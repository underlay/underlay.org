import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getLoginId } from "utils/server/auth/user";
import { getServerSupabase } from "utils/server/supabase";
import { getPatchIncrement, getMaxVersionNumber } from "utils/shared/version";

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
		include: { versions: true },
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

	return res.status(201).json(newVersion);
});
