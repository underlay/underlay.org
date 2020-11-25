import React from "react";
import { GetServerSideProps } from "next";
// import prisma from "utils/server/prisma";

import { SchemaPageFrame } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import { getSchemaPageHeaderData, getSchemaPagePermissions } from "utils/server/schemaPages";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

interface SchemaOverviewProps {
	schemaPageHeaderProps: SchemaPageHeaderProps;
}

export const getServerSideProps: GetServerSideProps<SchemaOverviewProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;
	const schemaPageHeaderProps = await getSchemaPageHeaderData(profileSlug, contentSlug);
	const hasAccess = getSchemaPagePermissions(context, schemaPageHeaderProps);
	if (!schemaPageHeaderProps || !hasAccess) {
		return { notFound: true };
	}

	return {
		props: {
			schemaPageHeaderProps: {
				...schemaPageHeaderProps,
				mode: "",
			},
		},
	};
};

const SchemaPage: React.FC<SchemaOverviewProps> = ({ schemaPageHeaderProps }) => {
	return (
		<SchemaPageFrame {...schemaPageHeaderProps}>
			<h1>Overview Content</h1>
		</SchemaPageFrame>
	);
};
export default SchemaPage;
