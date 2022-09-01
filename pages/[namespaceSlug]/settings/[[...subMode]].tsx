import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Intent, Button, FormGroup, InputGroup } from "@blueprintjs/core";
import { ExtendedCommunity, ExtendedUser } from "pages/[namespaceSlug]";

import {
	ProfileHeader,
	ThreeColumnFrame,
	Section,
	SideNav,
	AvatarUpload,
	Avatar,
} from "components";
import { useLocationContext, useLoginContext } from "utils/client/hooks";
import { ProfilePageParams } from "utils/shared/types";
import { getLoginId } from "utils/server/auth/user";
import { buildUrl } from "utils/shared/urls";
import { getNamespaceData } from "utils/server/queries";
import { useRouter } from "next/router";
import { slugifyString } from "utils/shared/strings";

type Props = {
	slug: string;
	community?: NonNullable<ExtendedCommunity>;
	user?: NonNullable<ExtendedUser>;
};

const UserSettings: React.FC<Props> = function ({ slug, community, user }) {
	const identity = user || community;
	const isUser = !!user;

	if (!identity) {
		return <div></div>;
	}

	const [name, setName] = useState(identity.name);
	const [nameSlug, setNameSlug] = useState(identity.namespace.slug);
	const [about, setAbout] = useState(identity.about!);
	const [avatar, setAvatar] = useState<string | undefined>(identity.avatar!);

	const [isUpdating, setIsUpdating] = useState(false);

	const router = useRouter();

	const { namespaceSlug = "", subMode } = useLocationContext().query;
	const activeSubMode = subMode && subMode[0];
	const loginData = useLoginContext();
	const isOwner = community
		? !!(
				loginData &&
				community.members.some((m) => m.permission === "owner" && m.userId === loginData.id)
		  )
		: !!(loginData && loginData.namespace.slug === namespaceSlug);

	const saveEdits = async () => {
		setIsUpdating(true);

		const slugifiedNameSlug = slugifyString(nameSlug);
		if (isUser) {
			await fetch("/api/user", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: identity.id,
					name,
					nameSlug: slugifiedNameSlug,
					about,
					avatar,
				}),
			});
		} else {
			await fetch("/api/community", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					id: identity.id,
					name,
					nameSlug: slugifiedNameSlug,
					about,
					avatar,
				}),
			});
		}
		setIsUpdating(false);

		if (namespaceSlug !== slugifiedNameSlug) {
			router.push(`/${nameSlug}/settings`);
		}
	};

	return (
		<div>
			<ProfileHeader
				type={community ? "community" : "user"}
				mode="settings"
				name={name}
				slug={slug}
				about={about}
				isOwner={isOwner}
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
								<FormGroup label="Slug" labelFor="slug-input">
									<InputGroup
										id="slug-input"
										required={true}
										value={nameSlug}
										onChange={(evt) => setNameSlug(evt.target.value)}
									/>
								</FormGroup>
								<FormGroup label="About" labelFor="about-input">
									<InputGroup
										id="about-input"
										required={true}
										value={about}
										onChange={(evt) => setAbout(evt.target.value)}
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
								<Button
									text="Update profile"
									intent={Intent.SUCCESS}
									style={{ marginTop: "12px" }}
									loading={isUpdating}
									onClick={() => {
										saveEdits();
									}}
								/>
							</Section>
						)}
						{isOwner && (
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

//@ts-ignore
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
