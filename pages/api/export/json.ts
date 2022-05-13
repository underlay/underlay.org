import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	// TODO: Make sure loginId has permissions for associated namespaceId
	const { collectionId, fileUri, mapping } = req.body;
	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		include: { schemas: { orderBy: { createdAt: "desc" } } },
	});
	if (!collection) {
		return res.status(500).json({ ok: false });
	}
	/* 
		On every published version, we need to update all exports

		Create export object with url and 
	*/

	return res.status(200).json(populatedExport);
});

// generateExportVersionJson(inputDataUrl, mapping)
// - get input file as json
// - go through each and create a new object that uses mapping (either includes name or skips value)
// - cache file
