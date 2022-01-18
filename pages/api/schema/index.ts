import nextConnect from "next-connect";
import auth from "utils/server/auth/middleware";
import prisma from "prisma/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.use(auth)
	.post(async (req, res) => {
		const collections = await prisma.collection.findMany();
		const collectionWithSchemas = collections.filter((c) => !!c.schemaJson);

		if (collectionWithSchemas.length > 0) {
			await prisma.collection.update({
				where: {
					id: collectionWithSchemas[0].id,
				},
				data: {
					schemaJson: req.body,
				},
			});
		} else {
			await prisma.collection.create({
				data: {
					slug: "test",
					permission: "",
					schemaJson: req.body,
				},
			});
		}

		return res.status(200);
	});
