import React from "react";
import { GetServerSideProps } from "next";

import { getResourcePagePermissions } from "utils/server/permissions";

import {
	selectResourcePageProps,
	prisma,
	serializeUpdatedAt,
	countCollectionVersions,
} from "utils/server/prisma";
import { CollectionPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";

import { CollectionPageFrame, CollectionVersionEditor } from "components";
import { LocationContext } from "utils/client/hooks";

type CollectionEditModeProps = CollectionPageProps & {
	latestVersion: { versionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<
	CollectionEditModeProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collectionWithVersion = await prisma.collection.findFirst({
		where: { id },
		select: {
			...selectResourcePageProps,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: { versionNumber: true },
			},
		},
	});

	// The reason to check if schema === null separately from getSchemaPagePermissions
	// is so that TypeScript know it's not null afterward
	if (collectionWithVersion === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, collectionWithVersion)) {
		return { notFound: true };
	}

	const versionCount = await countCollectionVersions(collectionWithVersion);

	const { versions, ...collection } = collectionWithVersion;
	const latestVersion = versions.length > 0 ? versions[0] : null;

	return {
		props: {
			versionCount,
			latestVersion,
			collection: serializeUpdatedAt(collection),
		},
	};
};

const CollectionEditPage: React.FC<CollectionEditModeProps> = (props) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "edit" }}>
			<CollectionPageFrame {...props}>
				<CollectionVersionEditor {...props} />
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default CollectionEditPage;
