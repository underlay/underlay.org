import { NextApiRequest, NextPageContext } from "next";

import { Session } from "next-auth/client";

export interface PageData {
	session: ClientSession | null;
	isStatic: boolean;
}

export interface ClientUser {
	id: string;
	slug: string | null;
	name: string | null;
	email: string | null;
	avatar: string | null;
}

export type ClientSession = Omit<Session, "user"> & { user: ClientUser };

// The typings for next-auth don't include an `id` property here
// because IDs aren't required in their base User prisma model.
// However, IDs are required in our (extended) model, and are
// returned with every user result from prisma, so there will
// always be an id property here as well.
declare module "next-auth/client" {
	function session(
		context: NextPageContext | { req: NextApiRequest }
	): Promise<ClientSession | null>;
}
