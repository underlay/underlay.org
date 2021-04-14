import React from "react";
import { CollectionVersionProps, ResourceProps } from "utils/shared/propTypes";

import { ReadmeViewer, ResourceVersionInfoPanel } from "components";
import { Button, DownloadIcon, majorScale, Pane } from "evergreen-ui";

export interface CollectionVersionOverviewProps {
	collection: ResourceProps;
	collectionVersion: CollectionVersionProps;
}

const CollectionVersionOverview: React.FC<CollectionVersionOverviewProps> = (props) => {
	const { id } = props.collection;
	const { versionNumber } = props.collectionVersion;
	const schemaURL = `/api/collection/${id}/${versionNumber}/index.schema`;
	const instanceURL = `/api/collection/${id}/${versionNumber}/index.instance`;

	return (
		<Pane display="flex">
			<Pane flex={1}>
				<ReadmeViewer source={props.collectionVersion.readme} />
			</Pane>
			<Pane marginX={majorScale(1)} alignSelf="stretch" border></Pane>
			<ResourceVersionInfoPanel
				resource={props.collection}
				resourceVersion={props.collectionVersion}
			>
				<Pane margin={majorScale(2)}>
					<Button is="a" href={schemaURL} iconBefore={<DownloadIcon />}>
						.schema
					</Button>
					<Button
						marginX={majorScale(2)}
						is="a"
						href={instanceURL}
						iconBefore={<DownloadIcon />}
					>
						.instance
					</Button>
				</Pane>
			</ResourceVersionInfoPanel>
		</Pane>
	);
};

export default CollectionVersionOverview;
