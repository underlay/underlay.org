import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import Avatar from "./Avatar";

export default {
	title: "Components/Avatar",
	component: Avatar,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<div>
		<Avatar initial="T" />
		<Avatar src="https://i.picsum.photos/id/92/300/300.jpg?hmac=wejPPm2iDwH8IF-wCg1XrQ5YocYqoNCFMjlLAfBSCU8" />
		<Avatar initial="T" width={64} />
	</div>
);
