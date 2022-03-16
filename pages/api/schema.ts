import nextConnect from "next-connect";
import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

import type { NextApiRequest, NextApiResponse } from "next";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	const { collectionId, schema } = req.body;
	await prisma.collection.update({
		where: {
			id: collectionId,
		},
		data: {
			schema,
		},
	});
	return res.status(200).json({ ok: true });
});
