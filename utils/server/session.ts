import { IncomingMessage } from "http";
import { GetServerSidePropsContext, NextPageContext } from "next";
import type { Session } from "next-auth";

import { ParsedUrlQuery } from "querystring";

const sessionMap = new WeakMap<IncomingMessage, Session | null>();

export function setCachedSession(ctx: NextPageContext, session: Session | null) {
	if (ctx.req !== undefined) {
		sessionMap.set(ctx.req, session);
	}
}

export function getCachedSession<P extends ParsedUrlQuery>({ req }: GetServerSidePropsContext<P>) {
	const session = sessionMap.get(req);
	if (session === undefined) {
		return null;
	} else {
		return session;
	}
}
