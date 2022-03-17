import nextConnect from "next-connect";
import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

import type { NextApiRequest, NextApiResponse } from "next";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	const { collectionId, newExport } = req.body;
	const newExportObject = await prisma.export.create({
		data: {
			...newExport,
			size: `${Math.round(Math.random() * 999)} kB`,
			collectionId: collectionId,
			userId: loginId,
		},
	});
	return res.status(200).json(newExportObject);
});
