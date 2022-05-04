import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Button, FormGroup, InputGroup } from "@blueprintjs/core";

import {
	ProfileHeader,
	ThreeColumnFrame,
	Section,
	SideNav,
	AvatarUpload,
	Avatar,
} from "components";
import { useLocationContext } from "utils/client/hooks";
import { ProfilePageParams } from "utils/shared/types";
import { getLoginId } from "utils/server/auth/user";
import { buildUrl } from "utils/shared/urls";
import { getNamespaceData } from "utils/server/queries";

type Props = {
	slug: string;
	community?: any;
	user?: any;
};

const UserSettings: React.FC<Props> = function ({ slug, community, user }) {
	const [name, setName] = useState(user.name);
	const [avatar, setAvatar] = useState<string | undefined>(user.avatar);
	const { namespaceSlug = "", subMode } = useLocationContext().query;
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
			<ThreeColumnFrame
				navContent={
					<SideNav
						menuItems={[
							{
								text: "Profile",
								href: buildUrl({
									namespaceSlug: namespaceSlug,
									mode: "settings",
									subMode: "",
								}),
								active: !activeSubMode,
							},
							{
								text: "Account",
								href: buildUrl({
									namespaceSlug: namespaceSlug,
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
							<Section title="Public Profile">
								<FormGroup label="Name" labelFor="name-input">
									<InputGroup
										id="name-input"
										required={true}
										value={name}
										onChange={(evt) => setName(evt.target.value)}
									/>
								</FormGroup>
								<FormGroup label="Avatar" labelFor="avatar-input">
									<div style={{ display: "flex", alignItems: "center" }}>
										<div style={{ marginRight: "10px" }}>
											<Avatar src={avatar} name={name} size={50} />
										</div>
										<AvatarUpload
											onComplete={(val: string) => {
												setAvatar(val);
											}}
										/>
										{avatar && (
											<Button
												icon="trash"
												minimal
												onClick={() => {
													setAvatar(undefined);
												}}
											/>
										)}
									</div>
								</FormGroup>
							</Section>
						)}
						{activeSubMode === "account" && (
							<Section title="User Account">
								<div>Delete Account</div>
							</Section>
						)}
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default UserSettings;

export const getServerSideProps: GetServerSideProps<Props, ProfilePageParams> = async (context) => {
	const { namespaceSlug, subMode } = context.params!;
	const profileData = await getNamespaceData(namespaceSlug);
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
			slug: profileData.community?.namespace.slug || profileData.user?.namespace.slug || "",
			community: profileData.community,
			user: profileData.user,
		},
	};
};
