import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SchemaContent from "./SchemaContent";
import { initialSchemaContent } from "components/SchemaEditor/SchemaEditor";

export default {
	title: "Components/SchemaContent",
	component: SchemaContent,
} as Meta;

export const Primary: React.FC<{}> = () => <SchemaContent initialValue={initialSchemaContent} />;
