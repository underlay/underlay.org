import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { findUserByEmail, validatePassword } from "utils/server/auth/user";
import { setLoginSession } from "utils/server/auth/session";

const authenticate = async (req: NextApiRequest) => {
	const { email, password } = req.body;
	return findUserByEmail(email).then((user) => {
		// @ts-ignore
		if (user && validatePassword(user, password)) {
			return user;
		} else {
			throw new Error("Invalid password");
		}
	});
};

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	try {
		const user = await authenticate(req);
		await setLoginSession(res, user.id);
		res.status(200).send({ done: true });
	} catch (error) {
		console.error(error);
		// @ts-ignore
		res.status(401).send(error.message);
	}
});
