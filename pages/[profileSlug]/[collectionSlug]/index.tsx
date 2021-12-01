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
	permission: string;
	labels?: any;
};

const CollectionOverview: React.FC<Props> = function ({ permission, labels }) {
	const { profileSlug = "", collectionSlug = "" } = useLocationContext();
	return (
		<div>
			<Head>
				<title>
					{profileSlug}/{collectionSlug} · Underlay
				</title>
			</Head>
			<CollectionHeader
				mode="overview"
				isPrivate={true || permission === "private"}
				labels={labels}
			/>
			<ResourceContentFrame content={<MainContent />} sideContent={<SideContent />} />
		</div>
	);
};

export default CollectionOverview;

export const getServerSideProps: GetServerSideProps<Props, CollectionPageParams> = async (
	context
) => {
	const { profileSlug, collectionSlug } = context.params!;
	const profileData = await getCollectionData(profileSlug, collectionSlug);
	const collectionData = profileData?.community?.collections[0];

	if (!collectionData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: collectionData.slug,
			permission: collectionData.permission,
			labels: collectionData.labels || undefined,
		},
	};
};
