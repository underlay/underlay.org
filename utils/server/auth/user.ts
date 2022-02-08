import prisma from "prisma/db";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";

import { getLoginSession } from "utils/server/auth/session";

export async function getLoginId(req: NextApiRequest | IncomingMessage): Promise<string> {
	const sessionUserId = await getLoginSession(req);
	return sessionUserId;
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
