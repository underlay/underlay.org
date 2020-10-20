import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SideComponent from "./Side";

export default {
	title: "Components/CollectionOverview",
	component: SideComponent,
} as Meta;

export const Side: React.FC<{}> = () => <SideComponent contributors={[]} />;
