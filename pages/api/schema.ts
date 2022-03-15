import nextConnect from "next-connect";
import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

import type { NextApiRequest, NextApiResponse } from "next";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	console;
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	await prisma.collection.update({
		where: {
			id: req.body.collection.id,
		},
		data: {
			schema: req.body.schema,
		},
	});
	return res.status(200);
	// } else {
	// 	return res.status(400);
	// }
});
