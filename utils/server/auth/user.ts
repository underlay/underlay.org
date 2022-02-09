import prisma from "prisma/db";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

import { getTokenCookie } from "utils/server/auth/cookies";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export async function getLoginId(req: NextApiRequest | IncomingMessage): Promise<string> {
	const sessionJWT = getTokenCookie(req);
	if (!sessionJWT) return "";

	try {
		const { sub: userId } = await jwt.verify(sessionJWT, JWT_SECRET);
		if (typeof userId !== "string") {
			throw "userId is not a string";
		}
		return userId;
	} catch (error) {
		console.error("In getLoginSession", error);
		return "";
	}
}

export async function findUserById(id: string) {
	if (!id) {
		return undefined;
	}
	const user = await prisma.profile.findUnique({
		where: { id },
		include: { namespace: true },
	});
	return user;
}
