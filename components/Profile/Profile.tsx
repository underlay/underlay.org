
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
import React from "react";

// import OverviewFrame from "components/OverviewFrame";
// import { Main, Side } from "components/ProfileOverview";
// import { usePageContext } from "utils/client/hooks";
// import { buildUrl } from "utils/shared/urls";

type Props = {
	organizationData: {};
};

const Profile: React.FC<Props> = function ({ organizationData }) {
	console.log(organizationData);
	return <h1>Profile Component</h1>
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

