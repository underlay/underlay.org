import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { parse } from "csv-parse";

import { getServerSupabase } from "utils/client/supabase";

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

		const fileName = `${namespaceSlug}/${collectionSlug}${collection?.version}.csv`;

		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		const records: any = await new Promise((resolve, reject) => {
			parse(text, (err, records, _info) => {
				if (err) reject(err);

				resolve(records);
			});
		});

		return res.status(200).json({ data: records });
	}
	return res.status(404);
});
