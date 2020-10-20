import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import Collection from "./Collection";

export default {
	title: "Components/Collection",
	component: Collection,
} as Meta;

export const Primary: React.FC<{}> = () => <Collection />;
