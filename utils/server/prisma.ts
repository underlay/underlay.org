import { Prisma, PrismaClient } from "@prisma/client";

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

export const findResourceWhere = (
	profileSlug: string,
	contentSlug: string
): Prisma.SchemaWhereInput & Prisma.CollectionWhereInput => ({
	slug: contentSlug,
	agent: {
		OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
	},
});

export const selectSchemaPageProps = {
	id: true,
	description: true,
	agent: true,
	isPublic: true,
	updatedAt: true,
};

export const selectVersionOverviewProps = {
	createdAt: true,
	versionNumber: true,
	content: true,
	readme: true,
};
