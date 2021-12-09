import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { slugifyString } from "utils/shared/strings";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get(async (_req, res) => {
		const users = await prisma.user.findMany();
		return res.json(users);
	})
	.post(async (req, res) => {
		if (!validateBody(req.body)) {
			return res.status(400);
		}

		const community = await prisma.community.create({
			data: {
				name: req.body.name,
				description: req.body.description,
				avatar: req.body.avatar,
				location: req.body.location,
				verifiedUrl: req.body.verifiedUrl,
				profile: {
					create: {
						slug: slugifyString(req.body.name),
					},
				},
			},
		});

		return res.status(200).json(community);
	});

export function validateBody(body: any) {
	const requiredParams = ["name", "description", "avatar", "location", "verifiedUrl"];
	for (const prop of requiredParams) {
		if (!(prop in body)) {
			return false;
		}
	}
	return true;
}
