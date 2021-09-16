import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";

import { ProfileHeader } from "components";
import { ResourcePageParams } from "utils/shared/types";
// import { getLoginData } from "utils/server/auth/user";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
};

const CommunityDiscussions: React.FC<Props> = function ({ name, slug, avatar }) {
	return (
		<div>
			<ProfileHeader
				type="community"
				mode="discussions"
				name={name}
				slug={slug}
				avatar={avatar}
			/>
		</div>
	);
};

export default CommunityDiscussions;

export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	// const loginData = await getLoginData(context.req);
	const { id } = context.params!;
	const communityData = await prisma.community.findUnique({
		where: { id: id },
		include: {
			profile: true,
		},
	});

	if (!communityData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: communityData.profile.slug,
			name: communityData.name,
			avatar: communityData.avatar || undefined,
			createdAt: communityData.createdAt,
		},
	};
};
