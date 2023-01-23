import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getServerSupabase } from "utils/server/supabase";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (req, res) => {
	const supabase = getServerSupabase();

	const namespaceSlug = req.query.namespaceSlug as string;
	const collectionSlug = req.query.collectionSlug as string;
	const versionNumber = req.query.version as string;
	const dontIncludeMetadata = (req.query.includeMetadata as string) === "false";

	const colSlugSuffix = collectionSlug.split("-").pop();

	if (namespaceSlug && collectionSlug) {
		const collection = await prisma.collection.findFirst({
			where: {
				slugSuffix: { equals: colSlugSuffix },
			},
			include: {
				namespace: true,
				exports: {
					include: {
						exportVersions: {
							include: {
								version: true,
							},
						},
					},
				},
			},
		});

		if (!collection) {
			return res.status(400).json({ ok: false });
		}

		const targetExportName = dontIncludeMetadata
			? `_default_nomd_${versionNumber}`
			: `_default_${versionNumber}`;

		const targetExport = collection.exports.find((e) => e.name === targetExportName);
		if (!targetExport) {
			return res.status(404);
		}

		const targetVersion = targetExport.exportVersions.find((v) => {
			return v.version.number === versionNumber;
		});
		if (!targetVersion) {
			return res.status(404);
		}

		const fileName = targetVersion.fileUri;

		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		return res.status(200).json({ data: JSON.parse(text) });
	}
	return res.status(404);
});
