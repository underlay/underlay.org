import React from "react";
import { GetServerSideProps } from "next";

import { ProfileHeader, ResourceContentFrame, Section, SideNav } from "components";
import { useLocationContext } from "utils/client/hooks";
import { ProfilePageParams } from "utils/shared/types";
import { getLoginId } from "utils/server/auth/user";
import { buildUrl } from "utils/shared/urls";
import { getProfileData } from "utils/server/queries";

type Props = {
	slug: string;
	community?: any;
	user?: any;
};

const UserSettings: React.FC<Props> = function ({ slug, community, user }) {
	const { profileSlug = "", subMode } = useLocationContext().query;
	const activeSubMode = subMode && subMode[0];
	return (
		<div>
			<ProfileHeader
				type={community ? "community" : "user"}
				mode="settings"
				name={community?.name || user?.name}
				slug={slug}
				avatar={community?.avatar || user?.avatar}
				verifiedUrl={community?.verifiedUrl}
				location={community?.location}
			/>
			<ResourceContentFrame
				navContent={
					<SideNav
						menuItems={[
							{
								text: "Profile",
								href: buildUrl({
									profileSlug: profileSlug,
									mode: "settings",
									subMode: "",
								}),
								active: !activeSubMode,
							},
							{
								text: "Account",
								href: buildUrl({
									profileSlug: profileSlug,
									mode: "settings",
									subMode: "account",
								}),
								active: activeSubMode === "account",
							},
						]}
					/>
				}
				content={
					<React.Fragment>
						{!activeSubMode && (
							<React.Fragment>
								<Section title="Public Profile">Details here</Section>
							</React.Fragment>
						)}
						{activeSubMode === "account" && "Account"}
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default UserSettings;

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { profileSlug, subMode } = context.params!;
	const profileData = await getProfileData(profileSlug);
	const validSubModes = ["account"];
	const isValidSubmode = !subMode || (subMode.length === 1 && validSubModes.includes(subMode[0]));
	if (!profileData || !isValidSubmode) {
		return { notFound: true };
	}

	const loginId = await getLoginId(context.req);

	const hasAccessUser = profileData.user && profileData.user.id === loginId;
	const hasAccessCommunity =
		profileData.community &&
		profileData.community.members.find((member) => {
			return member.userId === loginId;
		});

	/* Return 404 if neither userAccess nor communityAcces is truthy */
	if (!hasAccessUser && !hasAccessCommunity) {
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
