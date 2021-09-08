import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";
import Head from "next/head";

import { ProfileHeader, CollectionList, ResourceContentFrame, CommunityList } from "components";
import { ResourcePageParams } from "utils/shared/types";
// import { getLoginData } from "utils/server/auth/user";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
	createdAt: Date;
	memberships: any;
	collections: any;
};

const UserOverview: React.FC<Props> = function ({ name, slug, avatar, collections, memberships }) {
	return (
		<div>
			<Head>
				<title>
					{name} ({slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader type="user" mode="overview" name={name} slug={slug} avatar={avatar} />
			<ResourceContentFrame
				content={<CollectionList collections={collections} />}
				sideContent={<CommunityList memberships={memberships} />}
			/>
		</div>
	);
};

export default UserOverview;

export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	// const loginData = await getLoginData(context.req);
	const { id } = context.params!;
	const userData = await prisma.user.findUnique({
		where: { id: id },
		include: {
			profile: true,
			memberships: { include: { community: { include: { profile: true } } } },
			collections: true,
		},
	});

	if (!userData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: userData.profile.slug,
			name: userData.name,
			avatar: userData.avatar || undefined,
			createdAt: userData.createdAt,
			memberships: userData.memberships,
			collections: userData.collections,
		},
	};
};
