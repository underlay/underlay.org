import React from "react";
import Head from "next/head";

import {
	ProfileHeader,
	CollectionList,
	ThreeColumnFrame,
	Section,
	CommunityList,
} from "components";
import { ExtendedUser } from "pages/[namespaceSlug]";
import { useLocationContext, useLoginContext } from "utils/client/hooks";

type Props = {
	user: NonNullable<ExtendedUser>;
};

const UserOverview: React.FC<Props> = function ({ user }) {
	const { namespaceSlug = "" } = useLocationContext().query;
	const loginData = useLoginContext();

	const isProfileOwner = !!(loginData && loginData.namespace.slug === namespaceSlug);

	return (
		<div>
			<Head>
				<title>
					{user.name} ({user.namespace.slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type="user"
				mode="overview"
				name={user.name}
				slug={user.namespace.slug}
				isOwner={isProfileOwner}
				avatar={user.avatar}
			/>
			<ThreeColumnFrame
				content={
					<Section title="Collections">
						<CollectionList collections={user.namespace.collections} />
					</Section>
				}
				sideContent={<CommunityList memberships={user.memberships} />}
			/>
		</div>
	);
};

export default UserOverview;
