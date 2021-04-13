import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { prisma } from "utils/server/prisma";
import { resolveURI } from "utils/server/resolve";

const params = t.type({ id: t.string, versionNumber: t.string });

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });
	if (session === null) {
		return res.status(StatusCodes.FORBIDDEN).end();
	}

	if (!params.is(req.query)) {
		return res.status(StatusCodes.BAD_REQUEST).end();
	}

	const { id, versionNumber } = req.query;

	const collectionVersion = await prisma.collectionVersion.findUnique({
		where: { collectionId_versionNumber: { collectionId: id, versionNumber } },
		select: {
			collection: { select: { isPublic: true, agent: { select: { userId: true } } } },
			instanceURI: true,
		},
	});

	if (collectionVersion === null) {
		return res.status(StatusCodes.NOT_FOUND).end();
	} else if (
		collectionVersion.collection.isPublic ||
		collectionVersion.collection.agent.userId === session.user.id
	) {
		const data = await resolveURI(collectionVersion.instanceURI);
		res.status(200).send(data);
		return res.end();
	} else {
		return res.status(StatusCodes.NOT_FOUND).end();
	}
}
