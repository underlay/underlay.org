import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";

import {
	ProfileHeader,
	CollectionList,
	AvatarList,
	ResourceContentFrame,
	Section,
	CommunityList,
} from "components";
import { getNamespaceData } from "utils/server/queries";
import { ProfilePageParams } from "utils/shared/types";
import { Community, Namespace, Profile } from "@prisma/client";

type ExtendedCommunity = Community & Namespace;
type ExtendedUser = Profile & Namespace;
type Props = {
	community?: ExtendedCommunity;
	profile?: ExtendedUser;
};

const CommunityOverview: React.FC<Props> = function ({ community, user }) {
	return (
		<div>
			<Head>
				<title>
					{community?.name || user?.name} ({slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type={community ? "community" : "user"}
				mode="overview"
				name={community?.name || user?.name}
				slug={slug}
				avatar={community?.avatar || user?.avatar}
				verifiedUrl={community?.verifiedUrl}
				location={community?.location}
			/>
			<ResourceContentFrame
				content={
					<Section title="Collections">
						<CollectionList collections={community?.collections || user?.collections} />
					</Section>
				}
				sideContent={
					community ? (
						<React.Fragment>
							<Section title="About">{community.description}</Section>
							<AvatarList users={community.members.map((x: any) => x.user)} />
						</React.Fragment>
					) : (
						<CommunityList memberships={user.memberships} />
					)
				}
			/>
		</div>
	);
};

export default CommunityOverview;

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { namespaceSlug } = context.params!;
	const namespaceData = await getNamespaceData(namespaceSlug);
	console.log(namespaceData);
	if (!namespaceData) {
		return { notFound: true };
	}

	return {
		props: namespaceData,
	};
};
