import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { slugifyString } from "utils/shared/strings";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	const { name, description, avatar } = req.body;
	const newSlug = slugifyString(name);
	await prisma.community.create({
		data: {
			name,
			description,
			avatar,
			namespace: {
				create: {
					slug: newSlug,
				},
			},
			members: {
				create: {
					userId: loginId,
					permission: "owner",
				},
			},
		},
	});

	return res.status(200).json({ communitySlug: newSlug });
});
