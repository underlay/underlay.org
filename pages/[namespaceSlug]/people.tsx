import React from "react";
import { GetServerSideProps } from "next";
import { Prisma } from "@prisma/client";

import { getUserData, getCommunityData } from "utils/server/queries";
import { ProfilePageParams } from "utils/shared/types";

export type ExtendedCommunity = Prisma.PromiseReturnType<typeof getCommunityData>;
export type ExtendedUser = Prisma.PromiseReturnType<typeof getUserData>;

type Props = {
	community: ExtendedCommunity;
	user: ExtendedUser;
};

const NamespacePeople: React.FC<Props> = function ({ community, user }) {
	console.log(community, user);
	return null;
};

export default NamespacePeople;

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { namespaceSlug } = context.params!;

	const [communityData, userData] = await Promise.all([
		getCommunityData({
			slug: namespaceSlug,
			includeCollections: true,
		}),
		getUserData({
			slug: namespaceSlug,
			includeCollections: true,
		}),
	]);

	if (!communityData && !userData) {
		return { notFound: true };
	}
	return {
		props: {
			user: userData,
			community: communityData,
		},
	};
};
