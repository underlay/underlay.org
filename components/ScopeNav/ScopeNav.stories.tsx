import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import ScopeNav from "./ScopeNav";

export default {
	title: "Components/ScopeNav",
	component: ScopeNav,
} as Meta;

const wrapperStyle = {
	margin: "1em",
};

export const Primary: React.FC<{}> = () => (
	<div>
		<div style={wrapperStyle}>
			<ScopeNav
				navItems={[
					{ slug: "overview", title: "Overview" },
					{ slug: "query", title: "Query" },
				]}
			/>
		</div>
		<div style={wrapperStyle}>
			<ScopeNav
				navItems={[
					{
						slug: "overview",
						title: "Overview",
						children: [
							{ slug: "overview", title: "Overview" },
							{ slug: "assertions", title: "Assertions" },
						],
					},
					{ slug: "query", title: "Query" },
				]}
			/>
		</div>
	</div>
);
