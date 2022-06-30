import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { getSlugSuffix } from "utils/shared/strings";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (req, res) => {
	const namespaceSlug = req.query.namespaceSlug as string;
	const collectionSlug = req.query.collectionSlug as string;

	const colSlugSuffix = getSlugSuffix(collectionSlug);

	if (namespaceSlug && collectionSlug) {
		const collection = await prisma.collection.findFirst({
			where: {
				slugSuffix: { equals: colSlugSuffix },
			},
			include: {
				versions: true,
			},
		});

		if (!collection) {
			return res.status(400).json({ ok: false });
		}

		return res.status(200).json({ data: collection.versions });
	}
});
