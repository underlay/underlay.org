import React from "react";

import { GetServerSideProps } from "next";

import { CollectionPageFrame } from "components";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	prisma,
	selectResourcePageProps,
	countSchemaVersions,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { CollectionPageProps, getProfileSlug, ResourcePageParams } from "utils/shared/propTypes";

import { LocationContext } from "utils/client/hooks";

type CollectionVersionsProps = CollectionPageProps;

export const getServerSideProps: GetServerSideProps<
	CollectionVersionsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collection = await prisma.collection.findFirst({
		where: { id },
		select: selectResourcePageProps,
	});

	if (collection === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, collection)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(collection);
	return {
		props: {
			collection: serializeUpdatedAt(collection),
			versionCount,
		},
	};
};

const SchemaVersionsPage: React.FC<CollectionVersionsProps> = (props) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "versions" }}>
			<CollectionPageFrame {...props}>
				{/* <SchemaVersionHistory {...props} /> */}
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionsPage;
