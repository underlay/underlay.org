// @ts-nocheck
import nextConnect from "next-connect";
import auth from "utils/server/auth/middleware";
import prisma from "prisma/db";

import { slugifyString } from "utils/shared/strings";

export default nextConnect()
	.use(auth)
	.post(async (req, res) => {
		if (!req.user) {
			return res.status(403).json({ ok: false });
		}
		const collection = await prisma.collection.create({
			data: {
				slug: slugifyString(req.body.slug),
				permission: "public",
				user: {
					connect: [{ id: req.user.id }],
				},
			},
		});

		return res.status(200).json(collection);
	});
