import crypto from "crypto";
import type { NextApiResponse } from "next";
import { IncomingMessage } from "http";
import prisma from "prisma/db";

import { MAX_AGE, setTokenCookie, getTokenCookie, removeTokenCookie } from "./cookies";

// @ts-ignore
const TOKEN_SECRET: string = process.env.TOKEN_SECRET;

export async function setLoginSession(res: NextApiResponse, userId: string) {
	const sessionId = crypto.randomBytes(32).toString("base64");
	await prisma.session.create({
		data: {
			id: sessionId,
			userId,
			expiresAt: new Date(Date.now() + MAX_AGE * 1000),
		},
	});
	setTokenCookie(res, sessionId);
}

export async function getLoginSession(req: IncomingMessage) {
	const sessionId = getTokenCookie(req);
	if (!sessionId) return;

	const session = await prisma.session.findUnique({
		where: {
			id: sessionId,
		},
	});

	// Validate the expiration date of the session
	if (session && new Date() > session?.expiresAt) {
		await clearExpiredSessions();
		throw new Error("Session expired");
	}

	return session;
}

export async function removeLoginSession(req: IncomingMessage, res: NextApiResponse) {
	await clearExpiredSessions();

	const sessionId = getTokenCookie(req);
	if (!sessionId) return;

	await prisma.session.delete({
		where: {
			id: sessionId,
		},
	});

	removeTokenCookie(res);
}

async function clearExpiredSessions() {
	/* This function is called from a few places to do perioidic database */
	/* cleanup of expired sessions. */
	await prisma.session.deleteMany({
		where: {
			expiresAt: {
				lt: new Date(Date.now()),
			},
		},
	});
}
