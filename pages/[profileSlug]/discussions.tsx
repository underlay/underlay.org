import React from "react";
import { GetServerSideProps } from "next";

import { ProfileHeader } from "components";
import { ProfilePageParams } from "utils/shared/types";
import { getProfileData } from "utils/server/queries";

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

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { profileSlug } = context.params!;
	const profileData = await getProfileData(profileSlug);

	if (!profileData?.community) {
		return { notFound: true };
	}

	return {
		props: {
			slug: profileData?.slug,
			name: profileData?.community.name,
			avatar: profileData?.community.avatar || undefined,
		},
	};
};
