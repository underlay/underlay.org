import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import DiscussionList from "./DiscussionList";

export default {
	title: "Components/DiscussionList",
	component: DiscussionList,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<DiscussionList
		discussions={[
			{ id: "1", title: "A first discussion", number: 5 },
			{ id: "2", title: "Another discussion", number: 10 },
		]}
	/>
);
