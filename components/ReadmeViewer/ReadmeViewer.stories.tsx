import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import ReadmeViewer from "./ReadmeViewer";

export default {
	title: "Components/ReadmeViewer",
	component: ReadmeViewer,
} as Meta;

const initialReadmeContent = `# Test readme

- cool
- lists

and paragraphs

> and blockquotes
`;

export const Primary: React.FC<{}> = () => <ReadmeViewer source={initialReadmeContent} />;
