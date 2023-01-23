import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getServerSupabase } from "utils/server/supabase";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (req, res) => {
	const supabase = getServerSupabase();

	const namespaceSlug = req.query.namespaceSlug as string;
	const collectionSlug = req.query.collectionSlug as string;

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

		const targetExport = collection.exports.sort((a, b) => {
			return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		})[collection.exports.length - 1];
		if (!targetExport) {
			return res.status(400).json({ ok: false });
		}

		const sortedExportVersions = targetExport.exportVersions
			.sort((a, b) => {
				if (a.version.number > b.version.number) {
					return 1;
				}
				if (a.version.number < b.version.number) {
					return -1;
				}
				return 0;
			})
			.reverse();

		const fileName = sortedExportVersions[0].fileUri;

		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		return res.status(200).json({ data: JSON.parse(text) });
	}
	return res.status(404);
});
