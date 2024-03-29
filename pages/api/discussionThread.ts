import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	// TODO: Make sure loginId has permissions for associated collection
	const { collectionId, title, text, entityId } = req.body;
	const existingThreadCount = await prisma.discussionThread.count({
		where: {
			collectionId: collectionId,
		},
	});
	const newDiscussionThread = await prisma.discussionThread.create({
		data: {
			title: title,
			number: existingThreadCount + 1,
			collectionId: collectionId,
			entityId: entityId || null,
			userId: loginId,
		},
	});
	await prisma.discussionItem.create({
		data: {
			text: text,
			discussionThreadId: newDiscussionThread.id,
			userId: loginId,
		},
	});
	return res.status(200).json(newDiscussionThread);
});
