import React from "react";
import { GetServerSideProps } from "next";

import { ProfileHeader, ResourceContentFrame, Section, UserList } from "components";
import { getNamespaceData } from "utils/server/queries";
import { ProfilePageParams } from "utils/shared/types";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
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

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { namespaceSlug } = context.params!;
	const profileData = await getNamespaceData(namespaceSlug);

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
