import React from "react";

import { Heading, majorScale, Pane, Text } from "evergreen-ui";

export interface SchemaHeaderProps {
	profileSlug: string;
	schemaSlug: string;
	children?: React.ReactNode;
}

const SchemaHeader: React.FC<SchemaHeaderProps> = ({ profileSlug, schemaSlug, children }) => {
	return (
		<Pane display="flex">
			<Heading size={600} is="a" href={`/${profileSlug}`}>
				{profileSlug}
			</Heading>
			<Text size={600} marginX={majorScale(1)}>
				/
			</Text>
			<Text size={600}>schemas</Text>
			<Text size={600} marginX={majorScale(1)}>
				/
			</Text>
			<Heading size={600} is="a" href={`/${profileSlug}/schemas/${schemaSlug}`}>
				{schemaSlug}
			</Heading>
			{children}
		</Pane>
	);
};

export default SchemaHeader;
