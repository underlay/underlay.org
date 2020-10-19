import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Tag from "@atlaskit/tag/simple-tag";

import OverviewFrame from "./OverviewFrame";

export default {
	title: "Components/OverviewFrame",
	component: OverviewFrame,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<OverviewFrame
		className="organization-container"
		scopeHeaderProps={{
			type: "org",
			title: "Hello Org",
			avatar:
				"https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop",
			detailsTop: "my-slug",
			detailsBottom: <Tag color="greenLight" text="Verified: arnold.org" />,
		}}
		scopeNavProps={{
			navItems: [
				{ slug: "overview", title: "Overview" },
				{ slug: "query", title: "Query" },
				{ slug: "people", title: "People" },
				{
					slug: "discussions",
					title: "Discussions",
					children: [
						{ slug: "open", title: "Open" },
						{ slug: "closed", title: "Closed" },
					],
				},
			],
		}}
		content={<div style={{ background: "rgba(0,0,0,0.1", padding: "5em 2em" }}>Main</div>}
		sideContent={<div style={{ background: "rgba(0,0,0,0.2", padding: "5em 2em" }}>Side</div>}
	/>
);
