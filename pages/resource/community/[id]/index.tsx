import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";
import Head from "next/head";

import { ProfileHeader, CollectionList, AvatarList, ResourceContentFrame, Section } from "components";
import { ResourcePageParams } from "utils/shared/types";
// import { getLoginData } from "utils/server/auth/user";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
	description?: string;
	verifiedUrl?: string;
	location?: string;
	members: any;
	collections: any;
};

const CommunityOverview: React.FC<Props> = function ({
	name,
	slug,
	avatar,
	description,
	verifiedUrl,
	location,
	members,
	collections,
}) {
	return (
		<div>
			<Head>
				<title>
					{name} ({slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type="community"
				mode="overview"
				name={name}
				slug={slug}
				avatar={avatar}
				verifiedUrl={verifiedUrl}
				location={location}
			/>
			<ResourceContentFrame
				content={<Section title="Collections"><CollectionList collections={collections} /></Section>}
				sideContent={
					<React.Fragment>
						<Section title="About">{description}</Section>
						<AvatarList
							users={
								// @ts-ignore
								members.map((x) => x.user)
							}
						/>
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default CommunityOverview;

export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	// const loginData = await getLoginData(context.req);
	const { id } = context.params!;
	const communityData = await prisma.community.findUnique({
		where: { id: id },
		include: {
			profile: true,
			members: { include: { user: { include: { profile: true } } } },
			collections: true,
		},
	});

	if (!communityData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: communityData.profile.slug,
			name: communityData.name,
			description: communityData.description || undefined,
			verifiedUrl: communityData.verifiedUrl || undefined,
			location: communityData.location || undefined,
			avatar: communityData.avatar || undefined,
			createdAt: communityData.createdAt,
			members: communityData.members,
			collections: communityData.collections,
		},
	};
};
