import React from "react";
import { GetServerSideProps } from "next";

import { CollectionPageFrame, Section } from "components";
import { ResourcePageParams, getProfileSlug, CollectionPageProps } from "utils/shared/propTypes";

import { getResourcePagePermissions } from "utils/server/permissions";
import {
	countCollectionVersions,
	prisma,
	selectResourcePageProps,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { LocationContext } from "utils/client/hooks";

type CollectionSettingsProps = CollectionPageProps;

export const getServerSideProps: GetServerSideProps<
	CollectionSettingsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const collection = await prisma.collection.findFirst({
		where: { id },
		select: selectResourcePageProps,
	});

	if (collection === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, collection, true)) {
		return { notFound: true };
	}

	const versionCount = await countCollectionVersions(collection);

	return {
		props: {
			versionCount,
			collection: serializeUpdatedAt(collection),
		},
	};
};

const CollectionSettingsPage: React.FC<CollectionSettingsProps> = (props) => {
	const profileSlug = getProfileSlug(props.collection.agent);
	const contentSlug = props.collection.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "settings" }}>
			<CollectionPageFrame {...props}>
				<Section title="Settings" />
			</CollectionPageFrame>
		</LocationContext.Provider>
	);
};

export default CollectionSettingsPage;
