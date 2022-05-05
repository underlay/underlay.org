import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { slugifyString } from "utils/shared/strings";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.put(async (req, res) => {
		const loginId = await getLoginId(req);
		if (!loginId) {
			return res.status(403).json({ ok: false });
		}

		const { collectionId, updates } = req.body;
		// TODO: Make sure loginId has permissions for associated namespaceId
		await prisma.collection.update({
			where: {
				id: collectionId,
			},
			data: updates,
		});

		return res.status(200).json({ ok: true });
	})
	.post(async (req, res) => {
		const loginId = await getLoginId(req);
		if (!loginId) {
			return res.status(403).json({ ok: false });
		}

		// TODO: Make sure loginId has permissions for associated namespaceId
		const { namespaceId, name, description, isPublic, readme } = req.body;
		const newSlug = slugifyString(name);
		const newCollection = await prisma.collection.create({
			data: {
				slug: newSlug,
				description,
				readme,
				isPublic,
				namespaceId,
			},
		});

		const populatedCollection = await prisma.collection.findUnique({
			where: { id: newCollection.id },
			include: { namespace: true },
		});
		return res.status(200).json(populatedCollection);
	})
	.patch(async (req, res) => {
		const loginId = await getLoginId(req);
		if (!loginId) {
			return res.status(403).json({ ok: false });
		}

		await prisma.collection.update({
			where: {
				id: req.body.id,
			},
			data: {
				version: req.body.version,
				publishedAt: req.body.publishedAt,
				publishedDataSize: req.body.publishedDataSize,
				schemaMapping: req.body.schemaMapping,
			},
		});

		return res.status(200).json({ ok: true });
	});
