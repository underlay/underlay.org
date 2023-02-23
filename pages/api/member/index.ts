import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().put(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	const { action, communityId, communityOwnerIds, memberId, membershipId } = req.body;

	if (!communityOwnerIds.includes(loginId)) {
		return res.status(403).json({ ok: false });
	}

	if (action === "ADD") {
		const user = await prisma.user.findFirst({
			where: {
				namespace: { slug: memberId },
			},
			include: {
				memberships: true,
			},
		});

		if (!user) {
			return res.status(400).json({ ok: false });
		}

		await prisma.member.create({
			data: {
				communityId,
				userId: user.id,
				permission: "member",
			},
		});

		return res.status(200).json({ ok: true });
	}

	if (action === "REMOVE") {
		await prisma.member.delete({
			where: {
				id: membershipId,
			},
		});
		return res.status(200).json({ ok: true });
	}

	return res.status(400);
});
