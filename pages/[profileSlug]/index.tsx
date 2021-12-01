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
import { getProfileData } from "utils/server/queries";
import { ResourcePageParams } from "utils/shared/types";

type Props = {
	slug: string;
	community?: any;
	user?: any;
};

const CommunityOverview: React.FC<Props> = function ({ slug, community, user }) {
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

export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	const { profileSlug } = context.params!;
	const profileData = await getProfileData(profileSlug);

	if (!profileData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: profileData.slug,
			community: profileData.community,
			user: profileData.user,
		},
	};
};
