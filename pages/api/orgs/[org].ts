import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

interface ExtendedRequest {
	user: { id: string };
}

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get<ExtendedRequest>(async (req, res) => {
		const org = await prisma.profile.findUnique({
			where: {
				slug: req.query.org as string,
			},
			include: {
				community: true,
			},
		});
		if (!org) {
			res.end(404);
		}
		res.json(org);
	})
	.patch(async (req, res) => {
		const org = await prisma.profile.update({
			where: {
				slug: req.query.org as string,
			},
			data: {
				community: {
					update: {
						name: req.body.name,
					},
				},
			},
		});

		return res.status(200).json(org);
	})
	.delete(async (req, res) => {
		await prisma.profile.delete({
			where: {
				slug: req.query.org as string,
			},
		});
		return res.status(200);
	});
