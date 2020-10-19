import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import Icon from "./Icon";

export default {
	title: "Components/Icon",
	component: Icon,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<div>
	<div>
		<Icon icon="edit" size={64} />
		<Icon icon="home" size={64} />
		<Icon icon="collection" size={64} />
		<Icon icon="org" size={64} />
		<Icon icon="rocket" size={64} />
		<Icon icon="user" size={64} />
	</div>
	<div>
		<Icon icon="rocket" size={32} color="#ff00ff" />
	</div>
	</div>
);
