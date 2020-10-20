import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import DiscussionPreview from "./DiscussionPreview";

export default {
	title: "Components/DiscussionPreview",
	component: DiscussionPreview,
} as Meta;

const wrapperStyle = {
	margin: "1em",
};

export const Primary: React.FC<{}> = () => (
	<div>
		<div style={wrapperStyle}>
			<DiscussionPreview id="1" title={"A first discussion"} number={5} />
		</div>
		<div style={wrapperStyle}>
			<DiscussionPreview id="2" title={"Another discussion"} number={10} />
		</div>
	</div>
);
