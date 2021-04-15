import React from "react";

import { GetServerSideProps } from "next";

import { SchemaPageFrame, VersionHistory } from "components";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	prisma,
	selectResourcePageProps,
	serializeUpdatedAt,
	serializeCreatedAt,
	selectResourceVersionProps,
} from "utils/server/prisma";
import {
	getProfileSlug,
	ResourcePageParams,
	ResourceContentProps,
	ResourceVersionProps,
} from "utils/shared/propTypes";

import { LocationContext } from "utils/client/hooks";

interface SchemaVersionsProps {
	schema: ResourceContentProps;
	schemaVersions: ResourceVersionProps[];
}

export const getServerSideProps: GetServerSideProps<
	SchemaVersionsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersions = await prisma.schema.findFirst({
		where: { id },
		select: {
			...selectResourcePageProps,
			versions: {
				select: selectResourceVersionProps,
			},
		},
	});

	if (schemaWithVersions === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schemaWithVersions, false)) {
		return { notFound: true };
	}

	const { versions, ...schema } = serializeUpdatedAt(schemaWithVersions);

	return {
		props: {
			schema,
			schemaVersions: versions.map(serializeCreatedAt),
		},
	};
};

const SchemaVersionsPage: React.FC<SchemaVersionsProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	const versionCount = props.schemaVersions.length;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "versions" }}>
			<SchemaPageFrame {...props} versionCount={versionCount}>
				<VersionHistory versions={props.schemaVersions} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionsPage;
