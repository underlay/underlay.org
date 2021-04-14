import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	prisma,
	selectResourcePageProps,
	selectSchemaVersionOverviewProps,
	countSchemaVersions,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	SchemaPageProps,
	ResourcePageParams,
	getProfileSlug,
	SchemaVersionProps,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";
import { Paragraph } from "evergreen-ui";

type SchemaOverviewProps = SchemaPageProps & { latestVersion: SchemaVersionProps | null };

export const getServerSideProps: GetServerSideProps<
	SchemaOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersion = await prisma.schema.findUnique({
		where: { id },
		select: {
			...selectResourcePageProps,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: selectSchemaVersionOverviewProps,
			},
		},
	});

	// The reason to check for null separately from getResourcePagePermissions
	// is so that TypeScript know it's not null afterward
	if (schemaWithVersion === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schemaWithVersion, false)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schemaWithVersion);

	// We need to take the .versions property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const {
		versions: [latestVersion],
		...schema
	} = schemaWithVersion;

	return {
		props: {
			versionCount,
			schema: serializeUpdatedAt(schema),
			latestVersion: latestVersion === undefined ? null : serializeCreatedAt(latestVersion),
		},
	};
};

const SchemaOverviewPage: React.FC<SchemaOverviewProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<SchemaPageFrame {...props}>
				{props.latestVersion === null ? (
					<Paragraph fontStyle="italic">No versions yet!</Paragraph>
				) : (
					<SchemaVersionOverview
						schema={props.schema}
						schemaVersion={props.latestVersion}
					/>
				)}
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaOverviewPage;
