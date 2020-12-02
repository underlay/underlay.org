import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SchemaContent, { initialSchemaContent } from "./SchemaContent";

export default {
	title: "Components/SchemaContent",
	component: SchemaContent,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<>
		<section style={{ margin: "2em 0" }}>
			<h3>Editable</h3>
			<SchemaContent initialValue={initialSchemaContent} />
		</section>
		<section style={{ margin: "2em 0" }}>
			<h3>Read-only</h3>
			<SchemaContent initialValue={initialSchemaContent} readOnly={true} />
		</section>
	</>
);
