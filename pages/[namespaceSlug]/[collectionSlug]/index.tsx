import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";

import { CollectionHeader, ResourceContentFrame } from "components";
import { CollectionPageParams } from "utils/shared/types";
import MainContent from "components/CollectionOverview/MainContent";
import SideContent from "components/CollectionOverview/SideContent";
import { useLocationContext } from "utils/client/hooks";
import { getCollectionData } from "utils/server/queries";

type Props = {
	slug: string;
	isPublic: boolean;
	labels?: any;
};

const CollectionOverview: React.FC<Props> = function ({ isPublic, labels }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	return (
		<div>
			<Head>
				<title>
					{namespaceSlug}/{collectionSlug} · Underlay
				</title>
			</Head>
			<CollectionHeader mode="overview" isPrivate={!isPublic} labels={labels} />
			<ResourceContentFrame content={<MainContent />} sideContent={<SideContent />} />
		</div>
	);
};

export default CollectionOverview;

export const getServerSideProps: GetServerSideProps<Props, CollectionPageParams> = async (
	context
) => {
	const { namespaceSlug, collectionSlug } = context.params!;
	const collectionData = await getCollectionData(namespaceSlug, collectionSlug);

	if (!collectionData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: collectionData.slug,
			isPublic: collectionData.isPublic,
			labels: collectionData.labels || undefined,
		},
	};
};
