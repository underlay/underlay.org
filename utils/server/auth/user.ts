import crypto from "crypto";
import prisma from "prisma/db";
import { IncomingMessage } from "http";

import { getLoginSession } from "utils/server/auth/session";
import { LoginData } from "utils/shared/types";

type PrivateUser = {
	id: string;
	email: string;
	slug: string;
	hash: string;
	salt: string;
	createdAt: Date;
};

export async function getLoginData(req: IncomingMessage): Promise<LoginData> {
	const session = await getLoginSession(req);
	const user = session && (await findUserById(session.userId));

	return user
		? {
				id: user.id,
				slug: user.profile.slug,
				email: user.email,
				name: user.name,
				avatar: user.avatar || undefined,
				signupCompletedAt: user.signupCompletedAt || undefined,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
		  }
		: undefined;
}

export async function findUserByEmail(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		include: { profile: true },
	});
	return user;
}

export async function findUserById(id: string) {
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
