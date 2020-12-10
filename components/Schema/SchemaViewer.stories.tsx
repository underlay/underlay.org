import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { initialSchemaContent } from "utils/shared/schemas/initialContent";

import SchemaViewer from "./SchemaViewer";

export default {
	title: "Components/SchemaViewer",
	component: SchemaViewer,
} as Meta;

export const Primary: React.FC<{}> = () => <SchemaViewer value={initialSchemaContent} />;
