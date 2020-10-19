import React from 'react';
import { Meta } from "@storybook/react/types-6-0";

import Footer from "./Footer";

export default {
	title: "Components/Footer",
	component: Footer,
} as Meta;

export const Primary: React.FC<{}> = () => <Footer />;
