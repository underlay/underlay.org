import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import prisma from "utils/server/prisma";
import { getSchemaPageHeaderData, getSchemaPagePermissions } from "utils/server/schemaPages";
import { buildUrl } from "utils/shared/urls";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

interface SchemaOverviewProps {
	schemaPageHeaderProps: SchemaPageHeaderProps;
	currentVersion: SchemaVersion;
}

type SchemaVersion = {
	id: string;
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
};

export const getServerSideProps: GetServerSideProps<SchemaOverviewProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;
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

	const currentVersion = await prisma.schemaVersion.findFirst({
		where: {
			schemaId: schemaPageHeaderProps.schema.id,
		},
		orderBy: { createdAt: "desc" },
		select: {
			id: true,
			versionNumber: true,
			content: true,
			readme: true,
			createdAt: true,
		},
	});

	return {
		props: {
			schemaPageHeaderProps: {
				...schemaPageHeaderProps,
				mode: "",
			},
			currentVersion: { ...currentVersion!, createdAt: currentVersion!.createdAt.toISOString() },
		},
	};
};

const SchemaOverview: React.FC<SchemaOverviewProps> = ({
	schemaPageHeaderProps,
	currentVersion,
}) => {
	return (
		<SchemaPageFrame {...schemaPageHeaderProps}>
			<SchemaVersionOverview {...currentVersion} />
		</SchemaPageFrame>
	);
};
export default SchemaOverview;
