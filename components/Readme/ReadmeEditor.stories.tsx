import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import ReadmeEditor from "./ReadmeEditor";

export default {
	title: "Components/ReadmeEditor",
	component: ReadmeEditor,
} as Meta;

const initialReadmeContent = `# Test readme

- cool
- lists

and paragraphs

> and blockquotes
`;

export const Primary: React.FC<{}> = () => <ReadmeEditor initialValue={initialReadmeContent} />;
