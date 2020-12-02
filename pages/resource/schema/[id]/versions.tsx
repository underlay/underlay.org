import React from "react";

import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionHistory } from "components";
import { getSchemaPagePermissions } from "utils/server/permissions";

import {
	prisma,
	selectSchemaPageProps,
	countSchemaVersions,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { getProfileSlug, ResourcePageParams, SchemaPageProps } from "utils/shared/propTypes";

import { LocationContext } from "utils/client/hooks";

type SchemaVersionsModeProps = SchemaPageProps;

export const getServerSideProps: GetServerSideProps<
	SchemaVersionsModeProps,
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
			schema: serializeUpdatedAt(schema),
			versionCount,
		},
	};
};

const SchemaPage: React.FC<SchemaVersionsModeProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "versions" }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionHistory {...props} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaPage;
