import React from "react";
import { GetServerSideProps } from "next";
import { Prisma } from "@prisma/client";

import { CommunityOverview, UserOverview } from "components";
import { getUserData, getCommunityData } from "utils/server/queries";
import { ProfilePageParams } from "utils/shared/types";

export type ExtendedCommunity = Prisma.PromiseReturnType<typeof getCommunityData>;
export type ExtendedUser = Prisma.PromiseReturnType<typeof getUserData>;

type Props = {
	community: ExtendedCommunity;
	user: ExtendedUser;
};

const NamespaceOverview: React.FC<Props> = function ({ community, user }) {
	if (community) {
		return <CommunityOverview community={community} />;
	}
	if (user) {
		return <UserOverview user={user} />;
	}
	return null;
};

export default NamespaceOverview;

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
