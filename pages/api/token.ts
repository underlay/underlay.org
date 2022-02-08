import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { removeTokenCookie, setTokenCookie } from "utils/server/auth/cookies";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.post(async (req, res) => {
		try {
			setTokenCookie(res, req.body.token);
			return res.status(200).json({ ok: true });
		} catch (error) {
			console.log(error);
		}
	})
	.delete(async (_req, res) => {
		removeTokenCookie(res);
		return res.status(200).json({ ok: true });
	});
