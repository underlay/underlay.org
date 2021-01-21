import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const serializeUpdatedAt = <T>({ updatedAt, ...rest }: T & { updatedAt: Date }) => ({
	...rest,
	updatedAt: updatedAt.toISOString(),
});

export const serializeCreatedAt = <T>({ createdAt, ...rest }: T & { createdAt: Date }) => ({
	...rest,
	createdAt: createdAt.toISOString(),
});

export const countSchemaVersions = async ({ id }: { id: string }) =>
	prisma.schemaVersion.count({ where: { schemaId: id } });

export const countCollectionVersions = async ({ id }: { id: string }) =>
	prisma.schemaVersion.count({ where: { schemaId: id } });

export const selectResourcePageProps = {
	id: true,
	description: true,
	isPublic: true,
	updatedAt: true,
	slug: true,
	agent: {
		select: {
			user: { select: { id: true, slug: true } },
			organization: { select: { id: true, slug: true } },
		},
	},
};

export const selectSchemaVersionOverviewProps = {
	createdAt: true,
	versionNumber: true,
	content: true,
	readme: true,
};

export const selectCollectionVersionOverviewProps = {
	createdAt: true,
	versionNumber: true,
	readme: true,
};
