import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getServerSupabase } from "utils/server/supabase";
import { mapData } from "utils/shared/mapping";
import { Class, Mapping } from "utils/shared/types";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (req, res) => {
	// allow unauthenticated requests for now
	// const loginId = await getLoginId(req);
	// if (!loginId) {
	// 	return res.status(403).json({ ok: false });
	// }

	const supabase = getServerSupabase();

	const namespaceSlug = req.query.namespaceSlug as string;
	const collectionSlug = req.query.collectionSlug as string;

	if (namespaceSlug && collectionSlug) {
		const collection = await prisma.collection.findFirst({
			where: {
				slug: {
					equals: collectionSlug,
				},
				namespace: {
					slug: {
						equals: namespaceSlug,
					},
				},
			},
			include: {
				namespace: true,
			},
		});

		if (!collection) {
			return res.status(400);
		}

		const fileName = `${namespaceSlug}/${collectionSlug}${collection?.version}.csv`;

		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		const allNodes: Class[] = collection.schema as any;
		const nodes = allNodes.filter((n) => !n.isRelationship);
		const relationships: Class[] = allNodes.filter((n) => !!n.isRelationship);

		const resData = await mapData(
			text,
			nodes,
			relationships,
			collection.schemaMapping as Mapping
		);

		return res.status(200).json({ data: resData });
	}
	return res.status(404);
});
