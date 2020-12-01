import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import {
	prisma,
	findResourceWhere,
	selectSchemaPageProps,
	selectVersionOverviewProps,
	countSchemaVersions,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getSchemaPagePermissions } from "utils/server/permissions";
import { buildUrl } from "utils/shared/urls";
import { SchemaVersionOverviewProps } from "components/SchemaVersionOverview/SchemaVersionOverview";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

type SchemaOverviewProps = SchemaPageHeaderProps & { latestVersion: SchemaVersionOverviewProps };

export const getServerSideProps: GetServerSideProps<SchemaOverviewProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;

	const schemaWithVersion = await prisma.schema.findFirst({
		where: findResourceWhere(profileSlug, contentSlug),
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
		return {
			redirect: {
				destination: buildUrl({ profileSlug, contentSlug, mode: "edit", type: "schema" }),
				permanent: false,
			},
		};
	}

	const {
		versions: [latestVersion],
		...schema
	} = schemaWithVersion;

	return {
		props: {
			profileSlug,
			contentSlug,
			versionCount,
			schema: serializeUpdatedAt(schema),
			latestVersion: serializeCreatedAt(latestVersion),
		},
	};
};

const SchemaOverview: React.FC<SchemaOverviewProps> = ({ latestVersion, ...props }) => {
	return (
		<SchemaPageFrame {...props}>
			<SchemaVersionOverview {...latestVersion} />
		</SchemaPageFrame>
	);
};

export default SchemaOverview;
