import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import ScopeNav from "./ScopeNav";
import { LocationContext } from "utils/client/hooks";

export default {
	title: "Components/ScopeNav",
	component: ScopeNav,
} as Meta;

const wrapperStyle = {
	margin: "1em",
};

export const Primary: React.FC<{}> = () => (
	<LocationContext.Provider
		value={{ profileSlug: "emerson", contentSlug: "snap", mode: "overview" }}
	>
		<div>
			<div style={wrapperStyle}>
				<ScopeNav
					navItems={[
						{ mode: "overview", title: "Overview" },
						{ mode: "query", title: "Query" },
					]}
				/>
			</div>
			<div style={wrapperStyle}>
				<ScopeNav
					navItems={[
						{
							mode: "overview",
							title: "Overview",
						},
						{ mode: "query", title: "Query" },
					]}
				/>
			</div>
		</div>
	</LocationContext.Provider>
);
