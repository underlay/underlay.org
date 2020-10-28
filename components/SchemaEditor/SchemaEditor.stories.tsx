import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import SchemaEditor from "./SchemaEditor";

export default {
	title: "Components/SchemaEditor",
	component: SchemaEditor,
} as Meta;

const content = `# This is an example schema!
namespace = "http://example.com/"

[classes.Person]

[classes.Person.orcidId]
kind = "uri"
cardinality = "optional"

[classes.Person.name]
kind = "literal"
datatype = "string"
cardinality = "any"

[classes.Person.knows]
kind = "reference"
label = "Person"
cardinality = "any"
`;

export const Primary: React.FC<{}> = () => <SchemaEditor initialValue={content} />;
