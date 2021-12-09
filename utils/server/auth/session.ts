import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import Iron from "@hapi/iron";

import { setTokenCookie, getTokenCookie, removeTokenCookie } from "./cookies";

const IRON_SECRET: string = process.env.IRON_SECRET || "";

export async function setLoginSession(res: NextApiResponse, userId: string) {
	const sessionJWT = await Iron.seal(userId, IRON_SECRET, Iron.defaults);
	setTokenCookie(res, sessionJWT);
}

export async function getLoginSession(req: NextApiRequest | IncomingMessage) {
	const sessionJWT = getTokenCookie(req);
	if (!sessionJWT) return;

	try {
		const sessionUserId = await Iron.unseal(sessionJWT, IRON_SECRET, Iron.defaults);
		return sessionUserId;
	} catch (error) {
		return undefined;
	}
}

export async function removeLoginSession(_req: NextApiRequest, res: NextApiResponse) {
	removeTokenCookie(res);
}
