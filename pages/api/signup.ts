import crypto from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "prisma/db";
import nextConnect from "next-connect";

import { setLoginSession } from "utils/server/auth/session";

export type SignupPostBody = {
	email: string;
	name: string;
	slug: string;
	passwordHash: string;
	avatar?: string;
};

async function signupPost(req: NextApiRequest, res: NextApiResponse) {
	const submittedData: SignupPostBody = req.body;
	const { slug, passwordHash, ...signupData } = submittedData;
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.pbkdf2Sync(passwordHash, salt, 1000, 64, "sha512").toString("hex");

	try {
		const newUser = await prisma.user.create({
			data: {
				...signupData,
				profile: {
					create: {
						slug: slug,
					},
				},
				hash: hash,
				salt: salt,
				signupToken: crypto.randomBytes(16).toString("hex"),
				signupEmailCount: 1,
			},
		});

		// send email with token
		await setLoginSession(res, newUser.id);
		res.status(200).send({ done: true });
	} catch (error) {
		console.error(error);
		res.status(403).end(error.message);
	}
}

export default nextConnect().post(signupPost);
