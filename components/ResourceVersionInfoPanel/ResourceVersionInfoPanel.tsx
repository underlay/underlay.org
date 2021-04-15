import React from "react";

import { Heading, majorScale, minorScale, Pane, Paragraph, Text } from "evergreen-ui";

import { ResourceContentProps, ResourceVersionProps } from "utils/shared/propTypes";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

export interface ResourceVersionInfoPanelProps {
	resource: ResourceContentProps;
	resourceVersion: ResourceVersionProps;
}

const ResourceVersionInfoPanel: React.FC<ResourceVersionInfoPanelProps> = (props) => {
	const { profileSlug, contentSlug } = useLocationContext();

	const { versionNumber, createdAt } = props.resourceVersion;
	const date = new Date(createdAt);

	return (
		<Pane width={majorScale(40)} alignSelf="start" border background="tint2">
			<Pane margin={majorScale(2)}>
				<Heading is="a" href={buildUrl({ profileSlug })}>
					{profileSlug}
				</Heading>
				<Text marginX={minorScale(1)}>/</Text>
				<Heading is="a" href={buildUrl({ profileSlug, contentSlug })}>
					{contentSlug}
				</Heading>
				<Text marginX={minorScale(1)}>/</Text>
				<Heading is="a" href={buildUrl({ profileSlug, contentSlug, versionNumber })}>
					{versionNumber}
				</Heading>
			</Pane>
			<Paragraph margin={majorScale(2)}>Published {date.toDateString()}</Paragraph>
			{props.children}
		</Pane>
	);
};

export default ResourceVersionInfoPanel;
