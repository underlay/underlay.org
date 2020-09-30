import React from "react";
import { Meta } from "@storybook/react/types-6-0";

import CollectionPreview from "./CollectionPreview";

export default {
	title: "Components/CollectionPreview",
	component: CollectionPreview,
} as Meta;

const wrapperStyle = {
	margin: '1em',
};

export const Primary: React.FC<{}> = () => (
	<div>
		<div>
		<div style={wrapperStyle}>
			<CollectionPreview
				slug="Query"
				description="This is a package"
				numAssertions={14}
				numFiles={1}
				numVersions={5}
			/>
		</div>
		<div style={wrapperStyle}>
			<CollectionPreview
				slug="This is a package title that is really long, and while it doesn't make sense to have it be this long, we want to make sure it will ellipsize itself"
				description="This is a package with a really long description. And it keeps going, and we know it keeps going because we're the ones who are typing it here every so carefully."
				numAssertions={14}
				numFiles={1}
				numVersions={5}
			/>
		</div>
	</div>
		
	</div>
);


