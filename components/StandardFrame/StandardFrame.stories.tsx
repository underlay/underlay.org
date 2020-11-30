import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Badge } from "evergreen-ui";

import { Section, StandardFrame } from "components";

export default {
	title: "Components/StandardFrame",
	component: StandardFrame,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<StandardFrame
		className="organization-container"
		scopeHeaderProps={{
			type: "org",
			profileTitle: "Hello Org",
			profileSlug: 'hello',
			avatar:
				"https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop",
			detailsTop: "my-slug",
			detailsBottom: <Badge color="green">Verified: arnold.org</Badge>,
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
