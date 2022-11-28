import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";
import { v4 as uuidv4 } from "uuid";

import { getLoginId } from "utils/server/auth/user";
import { updateDraftVersion } from "utils/server/versions";

interface AttrDiff {
	nodeKey: string;
	nodeId: string;
	attrKey: string;
	oldAttrKey: string;
}
interface NodeDiff {
	key: string;
	oldNodeKey: string;
}

interface SchemaDiff {
	addedAttrs: AttrDiff[];
	updatedAttrs: AttrDiff[];
	removedAttrs: AttrDiff[];
	addedNodes: NodeDiff[];
	updatedNodes: NodeDiff[];
	removedNodes: NodeDiff[];
}

export default nextConnect<NextApiRequest, NextApiResponse>().post(async (req, res) => {
	const loginId = await getLoginId(req);
	if (!loginId) {
		return res.status(403).json({ ok: false });
	}

	// TODO: Make sure loginId has permissions for associated namespaceId
	const { collectionId, schema, newSchemaId, schemaDiff } = req.body;

	const collection = await prisma.collection.findFirst({
		where: {
			id: collectionId,
		},
		include: { inputs: true },
	});
	if (!collection) {
		return res.status(400);
	}

	const { updatedAttrs, removedAttrs, updatedNodes, removedNodes } = schemaDiff as SchemaDiff;

	if (
		updatedAttrs.length > 0 ||
		removedAttrs.length > 0 ||
		updatedNodes.length > 0 ||
		removedNodes.length > 0
	) {
		const inputObjectId = uuidv4();

		const sortedInputs = collection.inputs.sort((a, b) => {
			return a.createdAt.getTime() - b.createdAt.getTime();
		});
		const lastInput = sortedInputs[sortedInputs.length - 1];
		const newOutputData = getMigratedData(lastInput.outputData, schemaDiff);

		const inputObject = await prisma.input.create({
			data: {
				id: inputObjectId,
				reductionType: "overwrite",
				outputData: newOutputData,
				schemaId: newSchemaId,
				sourceCsvId: lastInput.sourceCsvId,
				collectionId,
			},
		});

		await updateDraftVersion(inputObject, collection.slugSuffix, schema);

		return res.status(200).json({ ok: true });
	}

	return res.status(200).json({ ok: true });
});

function getMigratedData(outputData: any, schemaDiff: SchemaDiff) {
	const { updatedAttrs, removedAttrs, updatedNodes, removedNodes } = schemaDiff;

	if (removedAttrs.length > 0) {
		removedAttrs.forEach((rattr) => {
			if (outputData[rattr.nodeKey]) {
				outputData[rattr.nodeKey].forEach((a: any) => {
					delete a[rattr.attrKey];
				});
			}
		});
	}

	if (updatedAttrs.length > 0) {
		updatedAttrs.forEach((uattr) => {
			if (outputData[uattr.nodeKey]) {
				outputData[uattr.nodeKey].forEach((a: any) => {
					a[uattr.attrKey] = a[uattr.oldAttrKey];
					delete a[uattr.oldAttrKey];
				});
			}
		});
	}

	if (removedNodes.length > 0) {
		removedNodes.forEach((rnode) => {
			delete outputData[rnode.key];
		});
	}

	if (updatedNodes.length > 0) {
		updatedNodes.forEach((unode) => {
			outputData[unode.key] = outputData[unode.oldNodeKey];
			delete outputData[unode.oldNodeKey];
		});
	}

	return outputData;
}
