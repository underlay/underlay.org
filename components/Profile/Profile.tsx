// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import ScopeHeader from "components/ScopeHeader/ScopeHeader";
import Section from "components/Section/Section";

import { majorScale, Pane, Table } from "evergreen-ui";
import React from "react";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

import styles from "./Profile.module.scss";

export interface ProfileProps {
	avatar?: string;
	schemas: {
		slug: string;
		isPublic: boolean;
		updatedAt: string;
	}[];
	collections: {
		slug: string;
		isPublic: boolean;
		updatedAt: string;
	}[];
}

const Profile: React.FC<ProfileProps> = ({ avatar, schemas, collections }) => {
	const { profileSlug } = useLocationContext();
	return (
		<Pane className={styles.profile}>
			<ScopeHeader type="user" profileTitle={profileSlug} avatar={avatar} />
			<Section title="Schemas">
				<Table width={majorScale(80)}>
					<Table.Body>
						{schemas.map(({ slug, updatedAt }) => (
							<Table.Row
								key={slug}
								is="a"
								href={buildUrl({ profileSlug, contentSlug: slug })}
							>
								<Table.TextHeaderCell>{slug}</Table.TextHeaderCell>
								<Table.TextCell>
									Last updated {new Date(updatedAt).toDateString()}
								</Table.TextCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
			</Section>
			<Section title="Collections">
				<Table width={majorScale(80)}>
					<Table.Body>
						{collections.map(({ slug, updatedAt }) => (
							<Table.Row
								key={slug}
								is="a"
								href={buildUrl({ profileSlug, contentSlug: slug })}
							>
								<Table.TextHeaderCell>{slug}</Table.TextHeaderCell>
								<Table.TextCell>
									Last updated {new Date(updatedAt).toDateString()}
								</Table.TextCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>
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
