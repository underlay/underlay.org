import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import Section from "./Section";

export default {
	title: "Components/Section",
	component: Section,
} as Meta;

const wrapperStyle = {
	margin: "1em",
};

export const Primary: React.FC<{}> = () => (
	<div>
		<div style={wrapperStyle}>
			<Section title="Query">This is my content</Section>
		</div>
		<div style={wrapperStyle}>
			<Section title="Query" useMargin={true}>
				This is my content
			</Section>
		</div>
		<div style={wrapperStyle}>
			<Section title="Messages" useMargin={false}>
				489
			</Section>
		</div>
	</div>
);
