import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";

import { ProfileHeader, ResourceContentFrame, Section, SideNav } from "components";
import { useLocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/types";
import { getLoginData } from "utils/server/auth/user";
import { buildUrl } from "utils/shared/urls";

type Props = {
	name: string;
	slug: string;
	avatar?: string;
	createdAt: Date;
};

const UserSettings: React.FC<Props> = function ({ name, slug, avatar }) {
	const { profileSlug = "", subMode } = useLocationContext();
	const activeSubMode = subMode && subMode[0];
	return (
		<div>
			<ProfileHeader type="user" mode="settings" name={name} slug={slug} avatar={avatar} />
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

export const getServerSideProps: GetServerSideProps<Props, ResourcePageParams> = async (
	context
) => {
	const validSubModes = ["account"];
	const { subMode } = context.query;
	if (subMode && (subMode.length > 1 || !validSubModes.includes(subMode[0]))) {
		return { notFound: true };
	}
	const loginData = await getLoginData(context.req);
	const { id } = context.params!;
	const userData = await prisma.user.findUnique({
		where: { id: id },
		include: {
			profile: true,
		},
	});

	if (!userData || loginData?.id !== userData.id) {
		return { notFound: true };
	}

	return {
		props: {
			slug: userData.profile.slug,
			name: userData.name,
			avatar: userData.avatar || undefined,
			createdAt: userData.createdAt,
		},
	};
};
