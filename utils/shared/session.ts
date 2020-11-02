import { NextApiRequest } from "next";
import { Session as ClientSession } from "next-auth/client";

export interface SessionUser {
	id: string;
	agentId: string;
	slug: string | null;
	name: string | null;
	email: string | null;
	avatar: string | null;
}

export type Session = Omit<ClientSession, "user"> & { user: SessionUser };

// The typings for next-auth don't include an `id` property here
// because IDs aren't required in their base User prisma model.
// However, IDs are required in our (extended) model, and are
// returned with every user result from prisma, so there will
// always be an id property here as well.
declare module "next-auth/client" {
	function session(context: { req: NextApiRequest }): Promise<Session | null>;
}
