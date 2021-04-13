import React from "react";
import { GetServerSideProps } from "next";

import { CollectionPageFrame, ReadmeViewer, VersionNavigator } from "components";
import {
	countCollectionVersions,
	prisma,
	selectResourcePageProps,
	selectCollectionVersionOverviewProps,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	CollectionPageProps,
	CollectionVersionProps,
	ResourcePageParams,
	getProfileSlug,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";
import { Pane, Paragraph } from "evergreen-ui";

export type CollectionVersionPageProps = CollectionPageProps & {
	collectionVersion: CollectionVersionProps;
	previousCollectionVersion: { versionNumber: string } | null;
	nextCollectionVersion: { versionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<
	CollectionVersionPageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collectionVersionWithCollection = await prisma.collectionVersion.findFirst({
		where: { id },
		select: {
			...selectCollectionVersionOverviewProps,
			previousVersion: { select: { versionNumber: true } },
			nextVersion: { select: { versionNumber: true } },
			collection: { select: selectResourcePageProps },
		},
	});

	if (collectionVersionWithCollection === null) {
		return { notFound: true };
	} else if (
		!getResourcePagePermissions(context, collectionVersionWithCollection.collection, false)
	) {
		return { notFound: true };
	}

	// We need to take the .collection property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const {
		collection,
		previousVersion,
		nextVersion,
		...collectionVersion
	} = collectionVersionWithCollection;

	const versionCount = await countCollectionVersions(collection);

	return {
		props: {
			versionCount,
			collection: serializeUpdatedAt(collection),
			collectionVersion: serializeCreatedAt(collectionVersion),
			previousCollectionVersion: previousVersion,
			nextCollectionVersion: nextVersion,
		},
	};
};

const CollectionVersionPage: React.FC<CollectionVersionPageProps> = ({
	collectionVersion,
	previousCollectionVersion,
	nextCollectionVersion,
	...props
}) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;
	const { versionNumber, readme } = collectionVersion;

	const previous = previousCollectionVersion?.versionNumber || null;
	const next = nextCollectionVersion?.versionNumber || null;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, versionNumber }}>
			<CollectionPageFrame {...props}>
				<VersionNavigator
					createdAt={collectionVersion.createdAt}
					previous={previous}
					next={next}
				/>
				<Pane>
					{readme === null ? (
						<Paragraph fontStyle="italic" color="muted">
							No readme
						</Paragraph>
					) : (
						<ReadmeViewer source={readme} />
					)}
				</Pane>
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default CollectionVersionPage;
