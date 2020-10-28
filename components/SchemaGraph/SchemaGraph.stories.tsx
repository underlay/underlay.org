import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { Right } from "fp-ts/Either";
import * as t from "io-ts";

import { TomlSchema } from "utils/shared/schemas/codec";
import { parseToml } from "utils/shared/schemas/parse";

import SchemaGraph from "./SchemaGraph";

export default {
	title: "Components/SchemaGraph",
	component: SchemaGraph,
} as Meta;

const defaultContent = `# This is an example schema!
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

const result = parseToml(defaultContent) as Right<t.TypeOf<typeof TomlSchema>>;

export const Primary = () => <SchemaGraph schema={result.right} />;
