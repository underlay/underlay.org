import { Schema, SchemaVersion } from "@prisma/client";

export type SerializedSchema = {
	[key in keyof Schema]: Schema[key] extends Date ? string : Schema[key];
};

export interface SerializedSchemaVersion {
	id: string;
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
}

export type SerializedSchemaWithVersions = SerializedSchema & {
	versions: SerializedSchemaVersion[];
};

export type SchemaWithVersions = Schema & {
	versions: Pick<SchemaVersion, keyof SerializedSchemaVersion>[];
};

export const serializeSchemaVersion = ({
	createdAt,
	agentId,
	schemaId,
	...rest
}: SchemaVersion): SerializedSchemaVersion => ({ ...rest, createdAt: createdAt.toISOString() });

export const serializeSchemaWithVersions = ({
	versions,
	...schema
}: SchemaWithVersions): SerializedSchemaWithVersions => ({
	...serializeSchema(schema),
	versions: versions.map(({ createdAt, ...rest }) => ({
		...rest,
		createdAt: createdAt.toISOString(),
	})),
});

export const serializeSchema = ({ createdAt, updatedAt, ...rest }: Schema): SerializedSchema => ({
	...rest,
	createdAt: createdAt.toISOString(),
	updatedAt: updatedAt.toISOString(),
});
