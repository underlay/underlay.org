import { PrismaClient } from "@prisma/client";

declare global {
	namespace NodeJS {
		interface Global {
			prisma: PrismaClient;
		}
	}
}

// This is to prevent primsa clients from accumulating during hot reloading
// https://github.com/prisma/prisma/issues/1983
function getPrismaClient() {
	if (process.env.NODE_ENV === "production") {
		return new PrismaClient();
	} else if (global.prisma instanceof PrismaClient) {
		return global.prisma;
	} else {
		global.prisma = new PrismaClient();
		return global.prisma;
	}
}

export const prisma = getPrismaClient();

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
	prisma.collectionVersion.count({ where: { collectionId: id } });

export const selectUserProps = {
	user: { select: { id: true, slug: true } },
};

// this will select an object of type { agent: AgentProps }
export const selectAgentProps = {
	agent: {
		select: {
			...selectUserProps,
			organization: { select: { id: true, slug: true } },
			id: true,
		},
	},
};

export const selectResourcePageProps = {
	id: true,
	description: true,
	isPublic: true,
	updatedAt: true,
	slug: true,
	...selectAgentProps,
};

// this will select an object of type ResourceVersionProps
export const selectResourceVersionProps = {
	id: true,
	createdAt: true,
	versionNumber: true,
	...selectUserProps,
};

// this will select an object of type SchemaVersionProps
export const selectSchemaVersionOverviewProps = {
	...selectResourceVersionProps,
	content: true,
	readme: true,
};

// this will select an object of type CollectionVersionProps
export const selectCollectionVersionOverviewProps = {
	...selectResourceVersionProps,
	readme: true,
};

// this will select an object of type ExecutionProps
export const selectExecutionOverviewProps = {
	...selectUserProps,
	id: true,
	executionNumber: true,
	successful: true,
	createdAt: true,
};
