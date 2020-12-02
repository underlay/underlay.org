import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, Section } from "components";
import { SchemaPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";

import { getSchemaPagePermissions } from "utils/server/permissions";
import {
	countSchemaVersions,
	prisma,
	selectSchemaPageProps,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { LocationContext } from "utils/client/hooks";

type SchemaSettingsModeProps = SchemaPageProps;

export const getServerSideProps: GetServerSideProps<
	SchemaSettingsModeProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schema = await prisma.schema.findFirst({
		where: { id },
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
			versionCount,
			schema: serializeUpdatedAt(schema),
		},
	};
};

const SchemaSettings: React.FC<SchemaSettingsModeProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "settings" }}>
			<SchemaPageFrame {...props}>
				<Section title="Settings" />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaSettings;
