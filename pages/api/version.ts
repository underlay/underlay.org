import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";
import { generateExportVersionJson } from "utils/server/exports/json";
import { getServerSupabase } from "utils/server/supabase";
import { getPatchIncrement, getMaxVersionNumber, isSameMinorVersion } from "utils/shared/version";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	// TODO: Make sure loginId has permissions for associated namespaceId
	const { collectionId } = req.body;
	const collection = await prisma.collection.findFirst({
		where: {
			id: collectionId,
		},
		include: { versions: true, exports: { include: { schema: true } } },
	});
	if (!collection) {
		return res.status(400);
	}
	const newVersion = await prisma.version.create({
		data: {
			number: getPatchIncrement(getMaxVersionNumber(collection.versions)),
			collectionId,
		},
	});

	/* Take current draft file and rename to versions/number */
	const supabase = getServerSupabase();
	await supabase.storage
		.from("data")
		.copy(
			`${collection.slugSuffix}/versions/draft.json`,
			`${collection.slugSuffix}/versions/${newVersion.number}.json`
		);

	/* TODO:
		Update existing exports
		Eventually - this should all be in a worker somewhere
		Eventually - we need to handle mapping when the minorVersion isn't the same
	*/
	const relevantExports = collection.exports.filter((exportObj) => {
		/* Filter only exports that have the same schema version - thus same mapping */
		return isSameMinorVersion(exportObj.schema.version, newVersion.number);
	});
	const newFileOutputs = await Promise.all(
		relevantExports.map((exportObj) => {
			return generateExportVersionJson(
				newVersion.id,
				collection.slugSuffix,
				exportObj.slug,
				// @ts-ignore
				exportObj.mapping
			);
		})
	);

	await Promise.all(
		// @ts-ignore
		newFileOutputs.map(({ fileUri, size }, index) => {
			return prisma.exportVersion.create({
				data: {
					fileUri,
					size,
					versionId: newVersion.id,
					exportId: relevantExports[index].id,
				},
			});
		})
	);

	return res.status(201).json(newVersion);
});
