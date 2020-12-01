import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { parse } from "@underlay/tasl-lezer";

import SchemaGraph from "./SchemaGraph";
import { initialSchemaContent } from "components/SchemaContent/SchemaContent";

export default {
	title: "Components/SchemaGraph",
	component: SchemaGraph,
} as Meta;

const { schema, namespaces } = parse(initialSchemaContent);

export const Primary = () => <SchemaGraph schema={schema} namespaces={namespaces} />;
