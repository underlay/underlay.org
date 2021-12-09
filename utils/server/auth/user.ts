import crypto from "crypto";
import prisma from "prisma/db";
import { NextApiRequest } from "next";
import { IncomingMessage } from "http";

import { getLoginSession } from "utils/server/auth/session";

type PrivateUser = {
	id: string;
	salt: string;
	hash: string;
};

export async function getLoginId(req: NextApiRequest | IncomingMessage): Promise<string> {
	const sessionUserId = await getLoginSession(req);
	return sessionUserId;
}

// export async function getLoginData(req: IncomingMessage): Promise<LoginData> {
// 	const session = await getLoginSession(req);
// 	const user = session && (await findUserById(session.userId));

// 	return user
// 		? {
// 				id: user.id,
// 				slug: user.profile.slug,
// 				email: user.email,
// 				name: user.name,
// 				avatar: user.avatar || undefined,
// 				signupCompletedAt: user.signupCompletedAt || undefined,
// 				createdAt: user.createdAt,
// 				updatedAt: user.updatedAt,
// 		  }
// 		: undefined;
// }

export async function findUserByEmail(email: string) {
	if (!email) {
		return undefined;
	}
	const user = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			salt: true,
			hash: true,
		},
	});
	return user;
}

export async function findUserById(id: string) {
	if (!id) {
		return undefined;
	}
	const user = await prisma.user.findUnique({
		where: { id },
		include: { profile: true },
	});
	return user;
}

export function validatePassword(user: PrivateUser, inputPassword: string): boolean {
	/* 	
		Compare the password of an already fetched user (using `findUser`)
		and compare the password for a potential match
	*/
	const inputHash = crypto
		.pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
		.toString("hex");
	return user.hash === inputHash;
}
