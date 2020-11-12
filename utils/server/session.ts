import { IncomingMessage } from "http";
import { GetServerSidePropsContext, NextPageContext } from "next";
import { ParsedUrlQuery } from "querystring";
import { ClientSession } from "utils/shared/session";

const sessionMap = new WeakMap<IncomingMessage, ClientSession | null>();

export function setCachedSession(ctx: NextPageContext, session: ClientSession | null) {
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
