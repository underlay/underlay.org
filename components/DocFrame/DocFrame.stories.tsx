import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import { DocFrame } from "components";

export default {
	title: "Components/DocFrame",
	component: DocFrame,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<DocFrame
		sections={[
			{ slug: "schemas", title: "Schemas" },
			{ slug: "collections", title: "Collections" },
		]}
		subSections={[
			{ slug: "values", title: "Values" },
			{ slug: "literals", title: "Literals" },
			{ slug: "uris", title: "URIs" },
			{ slug: "name-with-spaces", title: "Name with Spaces" },
		]}
		activeSection="schemas"
		activeSubSection="values"
		content={`# Hello
This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. This is some sample content that we're writing about. We think it is text that is of interest to someone. 		
		`}
	/>
);
