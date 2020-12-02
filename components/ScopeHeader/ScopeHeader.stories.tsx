import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { Badge } from "evergreen-ui";

import { ScopeHeader } from "components";
import { LocationContext } from "utils/client/hooks";

export default {
	title: "Components/ScopeHeader",
	component: ScopeHeader,
} as Meta;

const wrapperStyle = {
	margin: "3em 0em",
};

export const Primary: React.FC<{}> = () => (
	<div>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "fish-and-ducks" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader
					type="schema"
					detailsTop="3.2.0  ·  Updated 12 years ago"
					detailsBottom={
						<React.Fragment>
							<Badge>People</Badge>
							<Badge>schema.org</Badge>
							<Badge>actors</Badge>
						</React.Fragment>
					}
					avatar={undefined}
					isPrivate={true}
				/>
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "fish-and-ducks" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader
					type="schema"
					detailsTop="3.2.0  ·  Updated 12 years ago"
					detailsBottom={
						<React.Fragment>
							<Badge>People</Badge>
							<Badge>schema.org</Badge>
							<Badge>actors</Badge>
						</React.Fragment>
					}
					avatar={undefined}
				/>
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "biography" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader
					type="collection"
					detailsTop="3.2.0  ·  Updated 12 years ago"
					detailsBottom={
						<React.Fragment>
							<Badge>People</Badge>
							<Badge>schema.org</Badge>
							<Badge>actors</Badge>
						</React.Fragment>
					}
					avatar={undefined}
				/>
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider value={{ profileSlug: "megan-jorg" }}>
			<div style={wrapperStyle}>
				<ScopeHeader
					type="user"
					profileTitle="Megan Jorg III"
					detailsTop="megan-jorg"
					detailsBottom={<Badge color="green">Verified: @mjorg</Badge>}
					avatar="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=100&h=100&fit=crop"
				/>
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider value={{ profileSlug: "arnold-foundation" }}>
			<div style={wrapperStyle}>
				<ScopeHeader
					type="org"
					profileTitle="Arnold Foundation"
					detailsTop="arnold-foundation"
					detailsBottom={<Badge color="green">Verified: arnold.org</Badge>}
					avatar="https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop"
				/>
			</div>
		</LocationContext.Provider>
	</div>
);
