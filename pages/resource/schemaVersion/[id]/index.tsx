import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	countSchemaVersions,
	prisma,
	selectResourcePageProps,
	selectSchemaVersionOverviewProps,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

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
			...selectSchemaVersionOverviewProps,
			schema: { select: selectResourcePageProps },
		},
	});

	if (schemaVersionWithSchema === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schemaVersionWithSchema.schema)) {
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
	const versionNumber = schemaVersion.versionNumber;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, versionNumber }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionOverview {...schemaVersion} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionPage;
