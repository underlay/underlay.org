import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";
import Head from "next/head";

import { CollectionHeader, ResourceContentFrame } from "components";
import { ResourcePageParams } from "utils/shared/types";
import MainContent from "components/CollectionOverview/MainContent";
import SideContent from "components/CollectionOverview/SideContent";
// import { getLoginData } from "utils/server/auth/user";
import { useLocationContext } from "utils/client/hooks";

type Props = {
	slug: string;
	permission: string;
	labels?: string[];
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

// @ts-ignore
export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	// const loginData = await getLoginData(context.req);
	const { id } = context.params!;
	const collectionData = await prisma.collection.findUnique({
		where: { id: id },
	});

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
