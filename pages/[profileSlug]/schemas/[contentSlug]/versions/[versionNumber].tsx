import React from "react";
import { GetServerSideProps } from "next";
import semverValid from "semver/functions/valid";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import prisma from "utils/server/prisma";
import { getSchemaPageHeaderData, getSchemaPagePermissions } from "utils/server/schemaPages";
import { buildUrl } from "utils/shared/urls";


type SchemaVersionPageParams = {
	profileSlug: string;
	contentSlug: string;
	versionNumber: string;
};

interface SchemaVersionPageProps {
	schemaPageHeaderProps: SchemaPageHeaderProps;
	version: SchemaVersion;
}

interface SchemaVersion {
	id: string;
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
}

export const getServerSideProps: GetServerSideProps<SchemaVersionPageProps, SchemaVersionPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug, versionNumber } = context.params!;
	const schemaPageHeaderProps = await getSchemaPageHeaderData(profileSlug, contentSlug);
	const hasAccess = getSchemaPagePermissions(context, schemaPageHeaderProps);
	if (!schemaPageHeaderProps || !hasAccess) {
		return { notFound: true };
	}
	if (schemaPageHeaderProps.versionCount < 1) {
		/* If there are no versions yet, redirect to the */
		/* edit page for creation. */
		const { profileSlug, contentSlug } = schemaPageHeaderProps;
		return {
			redirect: {
				destination: buildUrl({
					profileSlug,
					contentSlug,
					mode: "edit",
					type: "schema",
				}),
				permanent: false,
			},
		};
	}

	if (semverValid(versionNumber) === null) {
		return { notFound: true };
	}

	const version = await prisma.schemaVersion.findFirst({
		where: {
			versionNumber,
			schemaId: schemaPageHeaderProps.schema.id
		},
		select: {
			id: true,
			versionNumber: true,
			content: true,
			readme: true,
			createdAt: true,
		},
	});

	if (!version) {
		return { notFound: true };
	}

	return {
		props: {
			schemaPageHeaderProps: {
				...schemaPageHeaderProps,
				mode: "versions",
			},
			version: { ...version, createdAt: version.createdAt.toISOString() },
		},
	};
};

const SchemaOverview: React.FC<SchemaVersionPageProps> = ({
	schemaPageHeaderProps,
	version,
}) => {
	return (
		<SchemaPageFrame {...schemaPageHeaderProps}>
			<SchemaVersionOverview {...version} />
		</SchemaPageFrame>
	);
};
export default SchemaOverview;
