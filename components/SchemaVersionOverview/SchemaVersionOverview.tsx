import React from "react";
import { ResourceProps, SchemaVersionProps } from "utils/shared/propTypes";

import { ReadmeViewer, ResourceVersionInfoPanel } from "components";
import { Button, DownloadIcon, majorScale, Pane } from "evergreen-ui";
import SchemaViewer from "components/Schema/SchemaViewer";

export interface SchemaVersionOverviewProps {
	schema: ResourceProps;
	schemaVersion: SchemaVersionProps;
}

const SchemaVersionOverview: React.FC<SchemaVersionOverviewProps> = (props) => {
	const schemaURL = `/api/schema/${props.schema.id}/${props.schemaVersion.versionNumber}/index.schema`;
	const taslURL = `/api/schema/${props.schema.id}/${props.schemaVersion.versionNumber}/index.tasl`;

	return (
		<>
			<Pane display="flex">
				<Pane flex={1}>
					<ReadmeViewer source={props.schemaVersion.readme} />
				</Pane>
				<Pane marginX={majorScale(1)} alignSelf="stretch" border></Pane>
				<ResourceVersionInfoPanel
					resource={props.schema}
					resourceVersion={props.schemaVersion}
				>
					<Pane margin={majorScale(2)}>
						<Button is="a" href={taslURL} iconBefore={<DownloadIcon />}>
							.tasl
						</Button>
						<Button
							marginX={majorScale(2)}
							is="a"
							href={schemaURL}
							iconBefore={<DownloadIcon />}
						>
							.schema
						</Button>
					</Pane>
				</ResourceVersionInfoPanel>
			</Pane>
			<SchemaViewer marginY={majorScale(2)} value={props.schemaVersion.content} />
		</>
	);
};

export default SchemaVersionOverview;
