import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	countSchemaVersions,
	prisma,
	selectSchemaPageProps,
	selectVersionOverviewProps,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getSchemaPagePermissions } from "utils/server/permissions";

import {
	SchemaPageProps,
	SchemaVersionProps,
	ResourcePageParams,
	getProfileSlug,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

export type SchemaVersionPageProps = SchemaPageProps & {
	schemaVersion: SchemaVersionProps;
};

export const getServerSideProps: GetServerSideProps<
	SchemaVersionPageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaVersionWithSchema = await prisma.schemaVersion.findFirst({
		where: { id },
		select: {
			...selectVersionOverviewProps,
			schema: { select: selectSchemaPageProps },
		},
	});

	if (schemaVersionWithSchema === null) {
		return { notFound: true };
	} else if (!getSchemaPagePermissions(context, schemaVersionWithSchema.schema)) {
		return { notFound: true };
	}

	// We need to take the .schema property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const { schema, ...schemaVersion } = schemaVersionWithSchema;

	const versionCount = await countSchemaVersions(schema);

	return {
		props: {
			mode: "versions",
			versionNumber: schemaVersion.versionNumber,
			versionCount,
			schema: serializeUpdatedAt(schema),
			schemaVersion: serializeCreatedAt(schemaVersion),
		},
	};
};

const SchemaVersionPage: React.FC<SchemaVersionPageProps> = ({ schemaVersion, ...props }) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionOverview {...schemaVersion} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionPage;
