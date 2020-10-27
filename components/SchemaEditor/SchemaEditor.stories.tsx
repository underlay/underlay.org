import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { Schema, SchemaVersion } from "@prisma/client";

import SchemaEditor from "./SchemaEditor";

export default {
	title: "Components/SchemaEditor",
	component: SchemaEditor,
} as Meta;

const content = `# This is an example schema!
namespace = "http://example.com/"

[shapes.Person]

[shapes.Person.orcidId]
kind = "uri"
cardinality = "optional"

[shapes.Person.name]
kind = "literal"
datatype = "string"
cardinality = "any"

[shapes.Person.knows]
kind = "reference"
label = "Person"
cardinality = "any"
`;

const now = new Date();

const schema: Schema = {
	id: "",
	slug: "people",
	agentId: "",
	createdAt: now,
	updatedAt: now,
};

const schemaVersion: SchemaVersion = {
	id: "",
	content,
	readme: null,
	versionNumber: "0.0.1",
	agentId: "",
	schemaId: "",
	createdAt: now,
};

export const Primary: React.FC<{}> = () => (
	<SchemaEditor schema={schema} schemaVersion={schemaVersion} />
);
