import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import CollectionList from "./CollectionList";

export default {
	title: "Components/CollectionList",
	component: CollectionList,
} as Meta;

export const Primary: React.FC<{}> = () => (
	<CollectionList
		collections={[
			{
				slug: "Query",
				description: "This is a package",
				numAssertions: 14,
				numFiles: 1,
				numVersions: 5,
			},
			{
				slug:
					"This is a package title that is really long, and while it doesn't make sense to have it be this long, we want to make sure it will ellipsize itself",
				description:
					"his is a package with a really long description. And it keeps going, and we know it keeps going because we're the ones who are typing it here every so carefully.",
				numAssertions: 23,
				numFiles: 129,
				numVersions: 50,
			},
		]}
	/>
);
