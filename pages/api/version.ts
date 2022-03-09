import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { getNextVersion } from "utils/shared/version";

export default nextConnect<NextApiRequest, NextApiResponse>().patch(async (req, res) => {
	const collection = await prisma.collection.findFirst({
		where: {
			id: req.body.id,
		},
	});
	if (!collection) {
		return res.status(400);
	}

	await prisma.collection.update({
		where: {
			id: req.body.id,
		},
		data: {
			version: getNextVersion(collection.version),
		},
	});

	return res.status(200);
});
