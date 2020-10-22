import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { Avatar } from "components";

export default {
	title: "Components/Avatar",
	component: Avatar,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<div>
		<Avatar name="T" />
		<Avatar src="https://i.picsum.photos/id/92/300/300.jpg?hmac=wejPPm2iDwH8IF-wCg1XrQ5YocYqoNCFMjlLAfBSCU8" />
		<Avatar name="T" size={64} />
	</div>
);
