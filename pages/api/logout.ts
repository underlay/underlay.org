import type { NextApiRequest, NextApiResponse } from "next";
import { removeLoginSession } from "utils/server/auth/session";

export default async function logout(req: NextApiRequest, res: NextApiResponse) {
	await removeLoginSession(req, res);
	res.status(200).send({ done: true });
}
