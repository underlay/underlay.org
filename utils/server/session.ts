import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { ClientSession } from "utils/shared/session";

const sessionMap = new WeakMap<IncomingMessage, ClientSession | null>();

export function cacheSession(ctx: NextPageContext, session: ClientSession | null) {
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
