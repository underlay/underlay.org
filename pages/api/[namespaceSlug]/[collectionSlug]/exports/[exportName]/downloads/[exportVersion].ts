import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getServerSupabase } from "utils/server/supabase";
import { getSlugSuffix } from "utils/shared/strings";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (req, res) => {
	const supabase = getServerSupabase();

	const namespaceSlug = req.query.namespaceSlug as string;
	const collectionSlug = req.query.collectionSlug as string;
	const exportName = req.query.exportName as string;
	const exportVersion = req.query.exportVersion as string;

	const colSlugSuffix = getSlugSuffix(collectionSlug);

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

		const targetExport = collection.exports.find((e) => e.name === exportName);
		if (!targetExport) {
			return res.status(400).json({ ok: false });
		}

		const targetExportVer = targetExport.exportVersions.find(
			(v) => v.version.number === exportVersion
		);

		const fileName = targetExportVer?.fileUri;
		if (!fileName) {
			return res.status(400).json({ ok: false });
		}

		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		return res.status(200).json({ data: JSON.parse(text) });
	}
	return res.status(404);
});
