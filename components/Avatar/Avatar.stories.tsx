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
		<Avatar src="https://assets.pubpub.org/mflaxicd/11505393046254.jpg" />
		<Avatar initial="T" width={64} />
	</div>
);
