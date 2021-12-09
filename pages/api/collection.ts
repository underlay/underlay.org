import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { slugifyString } from "utils/shared/strings";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (loginId) {
		return res.status(403).json({ ok: false });
	}
	const collection = await prisma.collection.create({
		data: {
			slug: slugifyString(req.body.slug),
			permission: "public",
			user: {
				connect: [{ id: loginId }],
			},
		},
	});

	return res.status(200).json(collection);
});
