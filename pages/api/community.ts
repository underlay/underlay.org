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
		const community = await prisma.community.create({
			data: {
				name: req.body.name,
				profile: {
					create: {
						slug: slugifyString(req.body.name),
					},
				},
				members: {
					create: {
						userId: req.user.id,
						permission: "owner",
					},
				},
			},
		});

		return res.status(200).json(community);
	});
