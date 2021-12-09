import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

interface ExtendedRequest {
	user: { id: string };
}

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get<ExtendedRequest>(async (req, res) => {
		const user = await prisma.profile.findUnique({
			where: {
				slug: req.query.user as string,
			},
			include: {
				user: true,
			},
		});
		return res.json(user);
	})
	.patch(async (req, res) => {
		const user = await prisma.profile.update({
			where: {
				slug: req.query.user as string,
			},
			data: {
				user: {
					update: {
						name: req.body.name,
					},
				},
			},
		});

		return res.status(200).json(user);
	})
	.delete(async (req, res) => {
		await prisma.profile.delete({
			where: {
				slug: req.query.user as string,
			},
		});
		return res.status(200);
	});
