import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";

import { ProfileHeader, ResourceContentFrame, Section, UserList } from "components";
import { ResourcePageParams } from "utils/shared/types";
// import { getLoginData } from "utils/server/auth/user";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
	createdAt: Date;
	members: any;
};

const CommunityPeople: React.FC<Props> = function ({ name, slug, avatar, members }) {
	return (
		<div>
			<ProfileHeader type="community" mode="people" name={name} slug={slug} avatar={avatar} />
			<ResourceContentFrame
				content={
					<React.Fragment>
						<Section title="Members">
							<UserList
								users={
									// @ts-ignore
									members.map((x) => x.user)
								}
							/>
						</Section>
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default CommunityPeople;

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
		},
	});

	if (!communityData) {
		return { notFound: true };
	}

	return {
		props: {
			name: communityData.name,
			slug: communityData.profile.slug,
			avatar: communityData.avatar || undefined,
			createdAt: communityData.createdAt,
			members: communityData.members,
		},
	};
};
