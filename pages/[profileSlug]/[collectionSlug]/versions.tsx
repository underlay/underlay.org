import React from "react";
import { GetServerSideProps } from "next";

import { CollectionHeader } from "components";
import { CollectionPageParams } from "utils/shared/types";
import { getCollectionData } from "utils/server/queries";

type Props = {
	slug: string;
};

const CollectionVersions: React.FC<Props> = function ({}) {
	return (
		<div>
			<CollectionHeader
				mode="versions"
				// details={slug}
			/>
		</div>
	);
};

export default CollectionVersions;

export const getServerSideProps: GetServerSideProps<Props, CollectionPageParams> = async (
	context
) => {
	const { profileSlug, collectionSlug } = context.params!;
	const collectionData = await getCollectionData(profileSlug, collectionSlug);

	if (!collectionData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: collectionData.slug,
		},
	};
};
