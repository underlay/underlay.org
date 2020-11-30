import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, Section } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
// import prisma from "utils/server/prisma";
import { getSchemaPageHeaderData, getSchemaPagePermissions } from "utils/server/schemaPages";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

interface SchemaSettingsProps {
	schemaPageHeaderProps: SchemaPageHeaderProps;
}

export const getServerSideProps: GetServerSideProps<SchemaSettingsProps, SchemaPageParams> = async (
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
				mode: "settings",
			},
			
		},
	};
};

const SchemaSettings: React.FC<SchemaSettingsProps> = ({ schemaPageHeaderProps }) => {
	return (
		<SchemaPageFrame {...schemaPageHeaderProps}>
			<Section title="Settings" />
		</SchemaPageFrame>
	);
};
export default SchemaSettings;
