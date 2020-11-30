import { GetServerSidePropsContext } from "next";

import prisma from "utils/server/prisma";
import { getCachedSession } from "utils/server/session";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";

export const getSchemaPageHeaderData = async (
	profileSlug: string,
	contentSlug: string
): Promise<SchemaPageHeaderProps | null> => {
	const schema = await prisma.schema.findFirst({
		where: {
			slug: contentSlug,
			agent: {
				OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
			},
		},
		select: {
			id: true,
			slug: true,
			description: true,
			isPublic: true,
			agent: { select: { userId: true } },
			updatedAt: true,
		},
	});

	if (!schema) {
		return null;
	}

	const versionCount = await prisma.schemaVersion.count({ where: { schemaId: schema?.id } });
	const currentVersionDetails = await prisma.schemaVersion.findFirst({
		where: {
			schemaId: schema.id,
		},
		orderBy: { createdAt: "desc" },
		select: {
			versionNumber: true,
			createdAt: true,
		},
	});

	const currentVersionDate = currentVersionDetails ? currentVersionDetails.createdAt.toISOString() : "";
	const currentVersionNumber = currentVersionDetails ? currentVersionDetails.versionNumber : "";

	return {
		contentSlug,
		profileSlug,
		versionCount,
		currentVersionDate: currentVersionDate,
		currentVersionNumber: currentVersionNumber,
		schema: { ...schema, updatedAt: schema.updatedAt.toISOString() },
	};
};

export const getSchemaPagePermissions = (
	context: GetServerSidePropsContext,
	schemaPageHeaderProps: SchemaPageHeaderProps | null
) => {
	const session = getCachedSession(context);

	if (!schemaPageHeaderProps) {
		return false;
	}

	const { schema } = schemaPageHeaderProps;
	if (!schema.isPublic) {
		if (session === null) {
			return false;
		}

		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session.user.id !== schema.agent.userId) {
			return false;
		}
	}
	return true;
};
