import React from "react";
import { GetServerSideProps } from "next";

import { ProfileHeader, ResourceContentFrame, Section, UserList } from "components";
import { getProfileData } from "utils/server/queries";
import { ResourcePageParams } from "utils/shared/types";

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
			members: profileData?.community.members,
		},
	};
};
