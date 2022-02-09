import { NextApiRequest, NextApiResponse } from "next";
import { IncomingMessage } from "http";
import { serialize, parse, CookieSerializeOptions } from "cookie";

const TOKEN_NAME = "token";
const MAX_AGE = 60 * 60 * 24 * 30; /* 30 days */

const cookieOptions: CookieSerializeOptions = {
	maxAge: MAX_AGE,
	expires: new Date(Date.now() + MAX_AGE * 1000),
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	path: "/",
	sameSite: "lax",
};

export function setTokenCookie(res: NextApiResponse, token: string) {
	const cookie = serialize(TOKEN_NAME, token, cookieOptions);
	res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie(res: NextApiResponse) {
	const removeOptions = {
		...cookieOptions,
		maxAge: -1,
		path: "/",
	};
	const cookie = serialize(TOKEN_NAME, "", removeOptions);
	res.setHeader("Set-Cookie", cookie);
}

export function parseCookies(req: NextApiRequest | IncomingMessage) {
	/* For API Routes we don't need to parse the cookies. */
	// @ts-ignore
	if (req.cookies) return req.cookies;

	/* For pages we do need to parse the cookies. */
	const cookie = req.headers?.cookie;
	return parse(cookie || "");
}

export function getTokenCookie(req: NextApiRequest | IncomingMessage) {
	const cookies = parseCookies(req);
	return cookies[TOKEN_NAME];
}
