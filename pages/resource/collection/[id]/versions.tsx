import React from "react";

import { GetServerSideProps } from "next";

import { Paragraph } from "evergreen-ui";

import { CollectionPageFrame, VersionHistory } from "components";
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
	ResourceProps,
	ResourceVersionProps,
} from "utils/shared/propTypes";

import { LocationContext } from "utils/client/hooks";

interface CollectionVersionsProps {
	collection: ResourceProps;
	collectionVersions: ResourceVersionProps[];
}

export const getServerSideProps: GetServerSideProps<
	CollectionVersionsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collectionWithVersions = await prisma.collection.findFirst({
		where: { id },
		select: {
			...selectResourcePageProps,
			versions: {
				select: selectResourceVersionProps,
			},
		},
	});

	if (collectionWithVersions === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, collectionWithVersions, false)) {
		return { notFound: true };
	}

	const { versions, ...collection } = serializeUpdatedAt(collectionWithVersions);

	return {
		props: {
			collection,
			collectionVersions: versions.map(serializeCreatedAt),
		},
	};
};

const SchemaVersionsPage: React.FC<CollectionVersionsProps> = (props) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;
	const versionCount = props.collectionVersions.length;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "versions" }}>
			<CollectionPageFrame {...props} versionCount={versionCount}>
				{versionCount ? (
					<VersionHistory versions={props.collectionVersions} />
				) : (
					<Paragraph fontStyle="italic">No versions yet!</Paragraph>
				)}
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionsPage;
