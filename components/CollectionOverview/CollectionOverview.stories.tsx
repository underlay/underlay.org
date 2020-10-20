import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import Main from "./Main";
import Side from "./Side";

export default {
	title: "Components/CollectionOverview",
	// component: Section,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<div>
		<Main assertions={[]} files={[]}/>
		<Side contributors={[]} />
	</div>
);
