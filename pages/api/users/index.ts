import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { slugifyString } from "utils/shared/strings";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get(async (_req, res) => {
		const communities = await prisma.community.findMany();
		return res.json(communities);
	})
	.post(async (req, res) => {
		if (!validateBody(req.body)) {
			return res.status(400);
		}

		const user = await prisma.user.create({
			data: {
				name: req.body.name,
				email: req.body.email,
				avatar: req.body.avatar,
				hash: "a",
				salt: "a",
				signupToken: slugifyString(req.body.name),
				signupEmailCount: 1,
				profile: {
					create: {
						slug: slugifyString(req.body.name),
					},
				},
			},
		});

		return res.status(200).json(user);
	});

function validateBody(body: any) {
	const requiredParams = ["name", "email", "avatar"];
	for (const prop of requiredParams) {
		if (!(prop in body)) {
			return false;
		}
	}
	return true;
}
