import React from "react";
import { GetServerSideProps } from "next";
import { Prisma } from "@prisma/client";
import Head from "next/head";

import {
	ProfileHeader,
	ThreeColumnFrame,
	MemberList,
} from "components";
import { useLoginContext } from "utils/client/hooks";

import { getUserData, getCommunityData } from "utils/server/queries";
import { ProfilePageParams } from "utils/shared/types";

export type ExtendedCommunity = Prisma.PromiseReturnType<typeof getCommunityData>;
export type ExtendedUser = Prisma.PromiseReturnType<typeof getUserData>;

type Props = {
	community: NonNullable<ExtendedCommunity>;
};

const MembersOverview: React.FC<Props> = function ({ community }) {
	const loginData = useLoginContext();
	const isCommunityOwner = !!(
		loginData &&
		community.members.some((m) => m.permission === "owner" && m.userId === loginData.id)
	);

	return (
		<div>
			<Head>
				<title>
					{community.name}({community.namespace.slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type={"community"}
				mode="members"
				name={community.name}
				slug={community.namespace.slug}
				about={community.about}
				isOwner={isCommunityOwner}
				avatar={community.avatar}
				verifiedUrl={community.verifiedUrl}
				location={community.location}
			/>
			<ThreeColumnFrame
				content={<MemberList community={community} members={community.members}></MemberList>}
				sideContent={<div></div>}
			/>
		</div>
	);
};

export default MembersOverview;

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { namespaceSlug } = context.params!;

	const communityData = await getCommunityData({
		slug: namespaceSlug,
		includeCollections: true,
	});

	if (!communityData) {
		return { notFound: true };
	}
	return {
		props: {
			community: communityData,
		},
	};
};
