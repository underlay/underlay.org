import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SideComponent from "./Side";

export default {
	title: "Components/ProfileOverview",
	component: SideComponent,
} as Meta;

export const Side: React.FC<{}> = () => <SideComponent discussions={[]} members={[]} />;
