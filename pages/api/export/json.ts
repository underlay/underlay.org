import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";
import { generateExportVersionJson } from "utils/server/exports/json";
import { generateRandomString } from "utils/shared/strings";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	// TODO: Make sure loginId has permissions for associated namespaceId
	const { name, format, isPublic, mapping, schemaId, collectionId, versionId } = req.body;
	const collection = await prisma.collection.findUnique({
		where: { id: collectionId },
		include: { schemas: { orderBy: { createdAt: "desc" } } },
	});
	if (!collection) {
		return res.status(500).json({ ok: false });
	}

	const exportSlug = generateRandomString(8);
	const exportObject = await prisma.export.create({
		data: {
			name,
			slug: exportSlug,
			format,
			isPublic,
			mapping,
			schemaId,
			collectionId,
			userId: loginId,
		},
	});

	const { fileUri, size } = await generateExportVersionJson(
		versionId,
		collection.slugSuffix,
		exportSlug,
		mapping
	);

	await prisma.exportVersion.create({
		data: {
			fileUri,
			size,
			versionId: versionId,
			exportId: exportObject.id,
		},
	});
	const populatedExport = await prisma.export.findUnique({
		where: {
			id: exportObject.id,
		},
		include: {
			exportVersions: { include: { version: true } },
			exportUses: { include: { user: true } },
		},
	});
	return res.status(200).json(populatedExport);
});
