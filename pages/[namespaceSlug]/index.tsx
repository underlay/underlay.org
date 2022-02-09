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
import { Collection, Community, Namespace, User } from "@prisma/client";

type ExtendNamespace = Namespace & { collections: Collection[] };
type ExtendedCommunity = Community & { namespace: Partial<ExtendNamespace> };
type ExtendedUser = User & { namespace: Partial<ExtendNamespace> };
type Props = {
	community?: ExtendedCommunity;
	user?: ExtendedUser;
};

const CommunityOverview: React.FC<Props> = function ({ community, user }) {
	console.log(community);
	return (
		<div>
			<Head>
				<title>
					{community?.name || user?.name} ({community?.slug || user?.slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type={community ? "community" : "user"}
				mode="overview"
				name={community?.name || user?.name}
				slug={community?.slug || user?.slug}
				avatar={community?.avatar || user?.avatar}
				verifiedUrl={community?.verifiedUrl}
				location={community?.location}
			/>
			<ResourceContentFrame
				content={
					<Section title="Collections">
						<CollectionList
							collections={
								community?.namespace.collections || user?.namespace.collections
							}
						/>
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
