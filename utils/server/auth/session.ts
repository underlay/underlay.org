import { NextApiRequest } from "next";
import { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

import { getTokenCookie } from "./cookies";

const JWT_SECRET: string = process.env.JWT_SECRET || "";

export async function getLoginSession(req: NextApiRequest | IncomingMessage): Promise<string> {
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
