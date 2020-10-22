import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { Profile } from "components";

export default {
	title: "Components/Profile",
	component: Profile,
} as Meta;

export const Primary: React.FC<{}> = () => <Profile organizationData={{}} />;
