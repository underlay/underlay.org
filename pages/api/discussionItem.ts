import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	const { discussionThreadId, text } = req.body;

	const newDiscussionItem = await prisma.discussionItem.create({
		data: {
			text: text,
			discussionThreadId: discussionThreadId,
			userId: loginId,
		},
	});
	const populatedDiscussionItem = await prisma.discussionItem.findUnique({
		where: {
			id: newDiscussionItem.id,
		},
		include: {
			user: {
				include: { namespace: true },
			},
		},
	});
	return res.status(200).json(populatedDiscussionItem);
});
