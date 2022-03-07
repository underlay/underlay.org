import React from "react";
import Head from "next/head";

import { ProfileHeader, CollectionList, AvatarList, ThreeColumnFrame, Section } from "components";
import { ExtendedCommunity } from "pages/[namespaceSlug]";

type Props = {
	community: NonNullable<ExtendedCommunity>;
};

const CommunityOverview: React.FC<Props> = function ({ community }) {
	return (
		<div>
			<Head>
				<title>
					{community.name}({community.namespace.slug}) · Underlay
				</title>
			</Head>
			<ProfileHeader
				type={"community"}
				mode="overview"
				name={community.name}
				slug={community.namespace.slug}
				avatar={community.avatar}
				verifiedUrl={community.verifiedUrl}
				location={community.location}
			/>
			<ThreeColumnFrame
				content={
					<Section title="Collections">
						<CollectionList collections={community.namespace.collections} />
					</Section>
				}
				sideContent={
					<React.Fragment>
						<Section title="About">{community.description}</Section>
						<AvatarList users={community.members.map((x: any) => x.user)} />
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default CommunityOverview;
