import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, Section } from "components";
import { SchemaPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";

import { getResourcePagePermissions } from "utils/server/permissions";
import {
	countSchemaVersions,
	prisma,
	selectResourcePageProps,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { LocationContext } from "utils/client/hooks";

type SchemaSettingsProps = SchemaPageProps;

export const getServerSideProps: GetServerSideProps<
	SchemaSettingsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schema = await prisma.schema.findFirst({
		where: { id },
		select: selectResourcePageProps,
	});

	if (schema === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schema, true)) {
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

const SchemaSettingsPage: React.FC<SchemaSettingsProps> = (props) => {
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

export default SchemaSettingsPage;
