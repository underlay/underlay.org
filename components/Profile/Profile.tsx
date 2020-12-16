// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import ScopeHeader from "components/ScopeHeader/ScopeHeader";
import Section from "components/Section/Section";

import { Card, majorScale, Pane, Text } from "evergreen-ui";
import React from "react";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

// import OverviewFrame from "components/OverviewFrame";
// import { Main, Side } from "components/ProfileOverview";
// import { usePageContext } from "utils/client/hooks";
// import { buildUrl } from "utils/shared/urls";

import styles from "./Profile.module.scss";

export interface ProfileProps {
	avatar?: string;
	schemas: {
		slug: string;
		description: string;
		avatar: string | null;
		isPublic: boolean;
		updatedAt: string;
	}[];
}

const Profile: React.FC<ProfileProps> = ({ avatar, schemas }) => {
	const { profileSlug } = useLocationContext();
	return (
		<Pane className={styles.profile}>
			<ScopeHeader type="user" profileTitle={profileSlug} avatar={avatar} />
			<Section title="Schemas">
				{schemas.map((schema) => (
					<Card
						key={schema.slug}
						className={styles.schema}
						is="a"
						textDecoration="none"
						href={buildUrl({ profileSlug, contentSlug: schema.slug })}
						border="default"
						padding={majorScale(2)}
						margin={majorScale(1)}
						backgroundColor="#E3DCD3"
						display="inline-block"
					>
						<h3>
							<span>{profileSlug}</span>
							<span style={{ margin: "0 4px" }}>/</span>
							<span>{schema.slug}</span>
						</h3>
						<Text>Last updated {new Date(schema.updatedAt).toDateString()}</Text>
					</Card>
				))}
			</Section>
		</Pane>
	);

	// const { title, avatar, slug, collections, discussions, members } = organizationData;
	// const { locationData } = usePageContext();
	// const { mode } = locationData.query;

	// const contentSwitch = {
	// 	overview: {
	// 		main: <Main collections={collections} />,
	// 		side: <Side discussions={discussions} members={members} />,
	// 	},
	// };
	// const activeContent = contentSwitch[mode] || {};
	// const { main, side } = activeContent;
	// return (
	// 	<OverviewFrame
	// 		className="organization-container"
	// 		scopeHeaderProps={{
	// 			type: "org",
	// 			title: (
	// 				<a href={buildUrl({ profileSlug: slug })} className="hoverline">
	// 					{title}
	// 				</a>
	// 			),
	// 			avatar: avatar,
	// 			detailsTop: slug,
	// 			// detailsBottom: (
	// 			// 	<Tag minimal intent={Intent.SUCCESS}>
	// 			// 		Verified: arnold.org
	// 			// 	</Tag>
	// 			// ),
	// 		}}
	// 		scopeNavProps={{
	// 			navItems: [
	// 				{ slug: "overview", title: "Overview" },
	// 				{ slug: "query", title: "Query" },
	// 				{ slug: "people", title: "People" },
	// 				{
	// 					slug: "discussions",
	// 					title: "Discussions",
	// 					children: [
	// 						{ slug: "open", title: "Open" },
	// 						{ slug: "closed", title: "Closed" },
	// 					],
	// 				},
	// 			],
	// 		}}
	// 		content={main}
	// 		sideContent={side}
	// 	/>
	// );
};

export default Profile;
