import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";
import { processCsv } from "utils/server/csv";

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
			- create sourceCsv object
			- get file from its public path
			- put it through whatever process we need to generate outputData (eventually we need to queue this over to a worker)
			- create input object
			- Generate the draft json
			- Save draft json
		*/
	const sourceCsv = await prisma.sourceCsv.create({
		data: {
			mapping,
			fileUri,
		},
	});
	const schema = collection.schemas[0];
	/* source + schema -> outputData */
	const outputData = await processCsv(schema, fileUri, mapping);
	const inputObject = await prisma.input.create({
		data: {
			reductionType: "merge",
			outputData: outputData,
			schemaId: schema.id,
			sourceCsvId: sourceCsv.id,
			collectionId: collectionId,
		},
	});
	// await updateDraftVersion(inputObject);

	return res.status(200).json(inputObject);
});
