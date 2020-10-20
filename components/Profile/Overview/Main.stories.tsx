import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import MainComponent from "./Main";

export default {
	title: "Components/ProfileOverview",
	component: MainComponent,
} as Meta;

export const Main: React.FC<{}> = () => <MainComponent collections={[]} />;
