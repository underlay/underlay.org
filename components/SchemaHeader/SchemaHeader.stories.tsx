import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SchemaHeader from "./SchemaHeader";

export default {
	title: "Components/SchemaHeader",
	component: SchemaHeader,
} as Meta;

export const Primary = () => <SchemaHeader profileSlug="emerson" schemaSlug="snap" />;
