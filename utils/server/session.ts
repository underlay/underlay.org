import type { IncomingMessage } from "http";
import type { NextPageContext } from "next";
import type { Session } from "next-auth";

const sessionMap = new WeakMap<IncomingMessage, Session | null>();

export function setCachedSession(ctx: NextPageContext, session: Session | null) {
	if (ctx.req !== undefined) {
		sessionMap.set(ctx.req, session);
	}
}

export function getCachedSession({ req }: { req: IncomingMessage }) {
	const session = sessionMap.get(req);
	if (session === undefined) {
		return null;
	} else {
		return session;
	}
}
