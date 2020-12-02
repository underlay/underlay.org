import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SchemaEditor from "./SchemaEditor";
import { initialSchemaContent } from "components/SchemaContent/SchemaContent";

export default {
	title: "Components/SchemaEditor",
	component: SchemaEditor,
} as Meta;

export const Primary: React.FC<{}> = () => <SchemaEditor initialValue={initialSchemaContent} />;
