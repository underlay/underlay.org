import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import Tag from "@atlaskit/tag/simple-tag";

import OverviewFrame from "./OverviewFrame";
import Section from "components/Section";

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
		content={
			<div>
				<Section title="Query 1" useMargin={true}>
					This is my content
				</Section>
				<Section title="Query 2" useMargin={true}>
					This is my content
				</Section>
			</div>
		}
		sideContent={
			<div>
				<Section title="Query 3" isSide={true}>
					This is my content
				</Section>
				<Section title="Query 4" isSide={true}>
					This is my content
				</Section>
			</div>
		}
	/>
);
