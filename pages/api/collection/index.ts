import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

import { generateRandomString, slugifyString } from "utils/shared/strings";
import { getLoginId } from "utils/server/auth/user";
import { getNamespaceData } from "utils/server/queries";

export default nextConnect<NextApiRequest, NextApiResponse>()
	.post(async (req, res) => {
		const loginId = await getLoginId(req);
		if (!loginId) {
			return res.status(403).json({ ok: false });
		}

		const { namespaceId, name, description, isPublic } = req.body;

		const newSlugPrefix = slugifyString(name);
		const newSlugSuffix = generateRandomString(10);
		const newCollection = await prisma.collection.create({
			data: {
				slugPrefix: newSlugPrefix,
				slugSuffix: newSlugSuffix,
				description,
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
	.put(async (req, res) => {
		const loginId = await getLoginId(req);
		if (!loginId) {
			return res.status(403).json({ ok: false });
		}

		const { collectionId, updates, namespaceSlug } = req.body;
		const namespaceData = await getNamespaceData(namespaceSlug);

		const isOwner =
			namespaceData?.user?.id === loginId ||
			namespaceData?.community?.members.map((m) => m.userId).includes(loginId);

		if (!isOwner) {
			return res.status(403).json({ ok: false });
		}

		await prisma.collection.update({
			where: {
				id: collectionId,
			},
			data: updates,
		});

		return res.status(200).json({ ok: true });
	});
