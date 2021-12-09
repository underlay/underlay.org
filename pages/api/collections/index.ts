import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

export default nextConnect<NextApiRequest, NextApiResponse>().get(async (_req, res) => {
	const collections = await prisma.collection.findMany();
	res.json(collections);
});
