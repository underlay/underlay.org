import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

interface ExtendedRequest {
	slug: string[];
}

export default nextConnect<NextApiRequest, NextApiResponse>().get<ExtendedRequest>(
	async (req, res) => {
		const user = await prisma.user.findFirst({
			where: {
				signupToken: {
					equals: req.query.slug[0] as string,
				},
			},
			include: {
				collections: true,
			},
		});
		const org = await prisma.community.findFirst({
			where: {
				id: req.query.slug[0] as string,
			},
			include: {
				collections: true,
			},
		});

		let allCollections = user?.collections ?? [];
		allCollections = allCollections.concat(org?.collections ?? []);

		if (req.query.slug[1]) {
			res.json(allCollections.filter((o) => o.slug === req.query.slug[1]));
		} else {
			res.json(allCollections);
		}
	}
);
