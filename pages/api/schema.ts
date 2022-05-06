import nextConnect from "next-connect";
import prisma from "prisma/db";
import { getLoginId } from "utils/server/auth/user";

import type { NextApiRequest, NextApiResponse } from "next";
import { getNextSchemaVersion } from "utils/server/schemas";
import collection from "./collection";

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}
	const { collectionId, schema } = req.body;

	/* TODO: Decide
	Perhaps we should keep schemas at 0.0.0 until there is some data.
	Do you really want 0.x.0 if there's no data attached to it?
	A collection is a schema + data pairing, it doesn't make sense for 0.5.0 to not have any data.
	A collection stays at 0.0.0 until it's first data.
	Version = null -> No schema or data
	Version = 0.0.0 -> Schema, no data
	Version = x.y.z (any one of those non-zero) -> schema, data.
	*/
	const newVersionNumber = await getNextSchemaVersion(collectionId);
	if (!newVersionNumber) {
		return res.status(500).json({ ok: false });
	}
	const newSchema = await prisma.schema.upsert({
		where: {
			collectionid_version: {
				collectionId: collectionId,
				version: newVersionNumber,
			},
		},
		create: {
			version: newVersionNumber,
			collectionId: collectionId,
			content: schema,
		},
		update: {
			content: schema,
		},
	});
	await prisma.collection.update({
		where: {
			id: collectionId,
		},
		data: {
			version: newVersionNumber,
		},
	});
	/* TODO: Implementation */
	/* This is the space where we will migrate data forward to the new schema */
	/* The result of updating the schema, if there is data, will always be a new */
	/* data version that uses the new schema. It will also kick off updating exports, etc */
	/* Perhaps we should have a generic space to do that. */
	/* If there are draft edits on the collection data, we may want to handle that more delicately. */
	/* For example, giving an option to: Update schema, and incorporate data edits in new version */

	return res.status(200).json(newSchema);
});
