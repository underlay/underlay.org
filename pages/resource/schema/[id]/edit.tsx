import React from "react";
import { GetServerSideProps } from "next";

import { getSchemaPagePermissions } from "utils/server/permissions";

import {
	countSchemaVersions,
	selectSchemaPageProps,
	prisma,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { SchemaPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";

import { SchemaPageFrame, SchemaVersionEditor } from "components";
import { LocationContext } from "utils/client/hooks";

// We use an intersection to "augment" the nested schema type
type SchemaEditModeProps = SchemaPageProps & {
	schema: {
		draftVersionNumber: string;
		draftContent: string;
		draftReadme: string | null;
	};
	latestVersion: { versionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<
	SchemaEditModeProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersion = await prisma.schema.findFirst({
		where: { id },
		select: {
			...selectSchemaPageProps,
			draftVersionNumber: true,
			draftContent: true,
			draftReadme: true,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: { versionNumber: true },
			},
		},
	});

	// The reason to check if schema === null separately from getSchemaPagePermissions
	// is so that TypeScript know it's not null afterward
	if (schemaWithVersion === null) {
		return { notFound: true };
	} else if (!getSchemaPagePermissions(context, schemaWithVersion)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schemaWithVersion);

	const { versions, ...schema } = schemaWithVersion;
	const latestVersion = versions.length > 0 ? versions[0] : null;

	return {
		props: {
			versionCount,
			latestVersion,
			schema: serializeUpdatedAt(schema),
		},
	};
};

const SchemaEditPage: React.FC<SchemaEditModeProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "edit" }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionEditor {...props} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaEditPage;
