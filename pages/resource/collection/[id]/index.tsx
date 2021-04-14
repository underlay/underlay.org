import React from "react";
import { GetServerSideProps } from "next";

import { Paragraph } from "evergreen-ui";

import {
	prisma,
	serializeUpdatedAt,
	serializeCreatedAt,
	selectResourcePageProps,
	selectCollectionVersionOverviewProps,
	countCollectionVersions,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	ResourcePageParams,
	getProfileSlug,
	CollectionPageProps,
	CollectionVersionProps,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";
import { CollectionPageFrame, CollectionVersionOverview } from "components";

type CollectionOverviewProps = CollectionPageProps & {
	lastVersion: CollectionVersionProps | null;
};

export const getServerSideProps: GetServerSideProps<
	CollectionOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collectionWithVersion = await prisma.collection.findUnique({
		where: { id },
		select: {
			...selectResourcePageProps,
			lastVersion: { select: selectCollectionVersionOverviewProps },
		},
	});

	// The reason to check for null separately from getResourcePagePermissions
	// is so that TypeScript knows it's not null afterward
	if (collectionWithVersion === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, collectionWithVersion, false)) {
		return { notFound: true };
	}

	const versionCount = await countCollectionVersions(collectionWithVersion);

	const { lastVersion, ...collection } = collectionWithVersion;

	return {
		props: {
			versionCount,
			collection: serializeUpdatedAt(collection),
			lastVersion: lastVersion && serializeCreatedAt(lastVersion),
		},
	};
};

const CollectionOverviewPage: React.FC<CollectionOverviewProps> = ({ lastVersion, ...props }) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<CollectionPageFrame {...props}>
				{lastVersion === null ? (
					<Paragraph fontStyle="italic">No versions yet!</Paragraph>
				) : (
					<CollectionVersionOverview
						collection={props.collection}
						collectionVersion={lastVersion}
					/>
				)}
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default CollectionOverviewPage;
