import React from 'react';
import { Meta } from "@storybook/react/types-6-0";

import Header from "components/Header";

export default {
	title: "Pages/[profileSlug]",
	component: Header,
} as Meta;

export const Primary: React.FC<{}> = () => <Header />;
