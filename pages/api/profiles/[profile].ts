import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

interface ExtendedRequest {
	profile: { id: string };
}

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get<ExtendedRequest>(async (req, res) => {
		const user = await prisma.profile.findFirst({
			where: {
				namespace: {
					slug: req.query.profile as string,
				},
			},
		});
		return res.json(user);
	})
	.patch(async (req, res) => {
		const user = await prisma.profile.updateMany({
			where: {
				namespace: {
					slug: req.query.profile as string,
				},
			},
			data: {
				name: req.body.name,
			},
		});

		return res.status(200).json(user);
	})
	.delete(async (_req, _res) => {
		// TODO: Delete a user is more complex than this and has multiple dependencies that must be handled
		// await prisma.profile.delete({
		// 	where: {
		// 		slug: req.query.profile as string,
		// 	},
		// });
		// return res.status(200);
	});
