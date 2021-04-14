import type { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { prisma, selectAgentProps } from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

const params = t.type({ id: t.string, versionNumber: t.string });

export default async function (req: NextApiRequest, res: NextApiResponse) {
	if (!params.is(req.query)) {
		return res.status(StatusCodes.BAD_REQUEST).end();
	}

	const { id, versionNumber } = req.query;

	const schemaVersion = await prisma.schemaVersion.findUnique({
		where: { schemaId_versionNumber: { schemaId: id, versionNumber } },
		select: {
			schema: { select: { slug: true, isPublic: true, ...selectAgentProps } },
			content: true,
		},
	});

	if (schemaVersion === null) {
		return res.status(StatusCodes.NOT_FOUND).end();
	} else if (!getResourcePagePermissions({ req }, schemaVersion.schema, false)) {
		return res.status(StatusCodes.NOT_FOUND).end();
	} else {
		const filename = `${schemaVersion.schema.slug}-${versionNumber}.tasl`;
		res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
		res.setHeader("Content-Type", "text/x-tasl");
		res.status(200).send(schemaVersion.content);
		return res.end();
	}
}
