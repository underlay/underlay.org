import nextConnect from "next-connect";
import auth from "utils/server/auth/middleware";
import prisma from "prisma/db";

import type { NextApiRequest, NextApiResponse } from "next";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.use(auth)
	.get(async (req, res) => {
		const collections = await prisma.collection.findMany();
		res.json(collections);
	});
