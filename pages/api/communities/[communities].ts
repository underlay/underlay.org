import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

interface ExtendedRequest {
	communities: { id: string };
}

export default nextConnect<NextApiRequest, NextApiResponse>()
	.get<ExtendedRequest>(async (req, res) => {
		const org = await prisma.community.findFirst({
			where: {
				namespace: {
					slug: req.query.org as string,
				},
			},
		});
		if (!org) {
			res.end(404);
		}
		res.json(org);
	})
	.patch(async (req, res) => {
		const org = await prisma.community.updateMany({
			where: {
				namespace: {
					slug: req.query.org as string,
				},
			},
			data: {
				name: req.body.name,
			},
		});

		return res.status(200).json(org);
	})
	.delete(async (_req, _res) => {
		// TODO: Delete a community is more complex than this and has multiple dependencies that must be handled
		// await prisma.profile.delete({
		// 	where: {
		// 		slug: req.query.org as string,
		// 	},
		// });
		// return res.status(200);
	});
