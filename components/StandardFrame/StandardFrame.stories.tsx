import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Badge } from "evergreen-ui";

import { Section, StandardFrame } from "components";
import { LocationContext } from "utils/client/hooks";

export default {
	title: "Components/StandardFrame",
	component: StandardFrame,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<LocationContext.Provider value={{ profileSlug: "hello" }}>
		<StandardFrame
			className="organization-container"
			scopeHeaderProps={{
				type: "org",
				profileTitle: "Hello Org",
				avatar:
					"https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop",
				detailsTop: "my-slug",
				detailsBottom: <Badge color="green">Verified: arnold.org</Badge>,
			}}
			scopeNavProps={{
				navItems: [
					{ title: "Overview" },
					{ mode: "query", title: "Query" },
					{ mode: "people", title: "People" },
					{
						mode: "discussions",
						title: "Discussions",
						children: [
							{ subMode: "open", title: "Open" },
							{ subMode: "closed", title: "Closed" },
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
	</LocationContext.Provider>
);
