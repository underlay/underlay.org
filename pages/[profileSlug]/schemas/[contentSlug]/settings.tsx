import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, Section } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";

import { getSchemaPagePermissions } from "utils/server/permissions";
import {
	countSchemaVersions,
	findResourceWhere,
	prisma,
	selectSchemaPageProps,
	serializeUpdatedAt,
} from "utils/server/prisma";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

type SchemaSettingsProps = SchemaPageHeaderProps;

export const getServerSideProps: GetServerSideProps<SchemaSettingsProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;

	const schema = await prisma.schema.findFirst({
		where: findResourceWhere(profileSlug, contentSlug),
		select: selectSchemaPageProps,
	});

	if (schema === null) {
		return { notFound: true };
	} else if (!getSchemaPagePermissions(context, schema)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schema);

	return {
		props: {
			mode: "settings",
			profileSlug,
			contentSlug,
			versionCount,
			schema: serializeUpdatedAt(schema),
		},
	};
};

const SchemaSettings: React.FC<SchemaSettingsProps> = (props) => {
	return (
		<SchemaPageFrame {...props}>
			<Section title="Settings" />
		</SchemaPageFrame>
	);
};
export default SchemaSettings;
