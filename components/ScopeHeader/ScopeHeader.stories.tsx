import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { ScopeHeader } from "components";
import { LocationContext } from "utils/client/hooks";

export default {
	title: "Components/ScopeHeader",
	component: ScopeHeader,
} as Meta;

const wrapperStyle = { margin: "3em" };

export const Primary: React.FC<{}> = () => (
	<div>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "fish-and-ducks" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader type="schema" isPublic={false} />
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "fish-and-ducks" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader type="schema" />
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider
			value={{ profileSlug: "arnold-foundation", contentSlug: "biography" }}
		>
			<div style={wrapperStyle}>
				<ScopeHeader type="collection" />
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider value={{ profileSlug: "megan-jorg" }}>
			<div style={wrapperStyle}>
				<ScopeHeader type="user" />
			</div>
		</LocationContext.Provider>
		<LocationContext.Provider value={{ profileSlug: "arnold-foundation" }}>
			<div style={wrapperStyle}>
				<ScopeHeader type="organization" />
			</div>
		</LocationContext.Provider>
	</div>
);
