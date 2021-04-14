import React from "react";

import {
	Button,
	DownloadIcon,
	Heading,
	majorScale,
	minorScale,
	Pane,
	Paragraph,
	Text,
} from "evergreen-ui";

import { ReadmeViewer, SchemaViewer } from "components";

import { SchemaVersionProps } from "utils/shared/propTypes";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

export interface SchemaVersionOverviewProps {
	schema: ResourceProps;
	schemaVersion: SchemaVersionProps;
}

const SchemaVersionOverview: React.FC<SchemaVersionOverviewProps> = (props) => {
	const { profileSlug, contentSlug } = useLocationContext();

	const { readme, content, versionNumber, createdAt } = props.schemaVersion;
	const date = new Date(createdAt);

	const schemaURL = `/api/schema/${props.schema.id}/${versionNumber}/index.schema`;
	const taslURL = `/api/schema/${props.schema.id}/${versionNumber}/index.tasl`;

	return (
		<React.Fragment>
			<Pane display="flex">
				<Pane flex={1}>
					<ReadmeViewer source={readme} />
				</Pane>
				<Pane marginX={majorScale(1)} alignSelf="stretch" border></Pane>
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
						<Heading
							is="a"
							href={buildUrl({ profileSlug, contentSlug, versionNumber })}
						>
							{versionNumber}
						</Heading>
					</Pane>
					<Paragraph margin={majorScale(2)}>Published {date.toDateString()}</Paragraph>
					<Pane margin={majorScale(2)} display="flex" justifyContent="space-between">
						<Button is="a" href={taslURL} iconBefore={<DownloadIcon />}>
							.tasl text
						</Button>
						<Button is="a" href={schemaURL} iconBefore={<DownloadIcon />}>
							.schema binary
						</Button>
					</Pane>
				</Pane>
			</Pane>
			<SchemaViewer marginY={majorScale(2)} value={content} />
		</React.Fragment>
	);
};

export default SchemaVersionOverview;
