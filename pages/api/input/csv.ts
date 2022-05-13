import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { v4 as uuidv4 } from "uuid";

import { getLoginId } from "utils/server/auth/user";
import { processCsv } from "utils/server/inputs/csv";
import { Schema } from "utils/shared/types";
import { updateDraftVersion } from "utils/server/versions";

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
		Create sourceCsv object
		Get file from its public path
		Put it through whatever process we need to generate outputData (eventually we need to queue this over to a worker)
		Create input object
		Generate and save the draft json
	*/
	const sourceCsv = await prisma.sourceCsv.create({
		data: {
			mapping,
			fileUri,
			userId: loginId,
		},
	});
	const inputObjectId = uuidv4();
	const schema = collection.schemas[0];
	const schemaContent = schema.content as Schema;
	/* source + schema -> outputData */
	const outputData = await processCsv(schemaContent, fileUri, mapping, inputObjectId);
	const inputObject = await prisma.input.create({
		data: {
			id: inputObjectId,
			reductionType: "merge", // merge, overwrite, concat
			outputData: outputData,
			schemaId: schema.id,
			sourceCsvId: sourceCsv.id,
			collectionId: collectionId,
		},
	});

	await updateDraftVersion(inputObject, collection.slugSuffix, schemaContent);

	const populatedInputObject = await prisma.input.findUnique({
		where: { id: inputObject.id },
		include: {
			sourceCsv: { include: { user: { include: { namespace: true } } } },
		},
	});
	return res.status(200).json(populatedInputObject);
});
