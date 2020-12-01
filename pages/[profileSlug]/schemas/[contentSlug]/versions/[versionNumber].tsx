import React from "react";
import { GetServerSideProps } from "next";
import semverValid from "semver/functions/valid";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	countSchemaVersions,
	findResourceWhere,
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
	SchemaVersionPageParams,
} from "utils/server/schemaPage";

type SchemaVersionPageProps = SchemaPageProps & {
	schemaVersion: SchemaVersionProps;
};

export const getServerSideProps: GetServerSideProps<
	SchemaVersionPageProps,
	SchemaVersionPageParams
> = async (context) => {
	const { profileSlug, contentSlug, versionNumber } = context.params!;

	if (semverValid(versionNumber) === null) {
		return { notFound: true };
	}

	const schemaVersionWithSchema = await prisma.schemaVersion.findFirst({
		where: { schema: findResourceWhere(profileSlug, contentSlug), versionNumber },
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
			profileSlug,
			contentSlug,
			versionNumber,
			versionCount,
			schema: serializeUpdatedAt(schema),
			schemaVersion: serializeCreatedAt(schemaVersion),
		},
	};
};

const SchemaOverview: React.FC<SchemaVersionPageProps> = ({ schemaVersion, ...props }) => {
	return (
		<SchemaPageFrame {...props}>
			<SchemaVersionOverview {...schemaVersion} />
		</SchemaPageFrame>
	);
};

export default SchemaOverview;
