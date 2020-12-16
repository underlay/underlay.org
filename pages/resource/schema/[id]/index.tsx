import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	prisma,
	selectSchemaPageProps,
	selectVersionOverviewProps,
	countSchemaVersions,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getSchemaPagePermissions } from "utils/server/permissions";
import { buildUrl } from "utils/shared/urls";

import {
	SchemaPageProps,
	ResourcePageParams,
	getProfileSlug,
	SchemaVersionProps,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

type SchemaOverviewProps = SchemaPageProps & { latestVersion: SchemaVersionProps };

export const getServerSideProps: GetServerSideProps<
	SchemaOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersion = await prisma.schema.findUnique({
		where: { id },
		select: {
			...selectSchemaPageProps,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: selectVersionOverviewProps,
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

	if (versionCount < 1) {
		const profileSlug = getProfileSlug(schemaWithVersion.agent);
		return {
			redirect: {
				destination: buildUrl({
					profileSlug,
					contentSlug: schemaWithVersion.slug,
					mode: "edit",
				}),
				permanent: false,
			},
		};
	}

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
			latestVersion: serializeCreatedAt(latestVersion),
		},
	};
};

const SchemaOverviewPage: React.FC<SchemaOverviewProps> = ({ latestVersion, ...props }) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionOverview {...latestVersion} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaOverviewPage;
