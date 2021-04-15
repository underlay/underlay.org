import React from "react";
import {
	CollectionVersionProps,
	getProfileSlug,
	ResourceContentProps,
} from "utils/shared/propTypes";

import { ReadmeViewer, ResourceVersionInfoPanel } from "components";
import { Button, DownloadIcon, Link, majorScale, Pane, Paragraph } from "evergreen-ui";
import { buildUrl } from "utils/shared/urls";

export interface CollectionVersionOverviewProps {
	collection: ResourceContentProps;
	collectionVersion: CollectionVersionProps;
}

const CollectionVersionOverview: React.FC<CollectionVersionOverviewProps> = (props) => {
	const { id } = props.collection;
	const { versionNumber, execution } = props.collectionVersion;
	const schemaURL = `/api/collection/${id}/${versionNumber}/index.schema`;
	const instanceURL = `/api/collection/${id}/${versionNumber}/index.instance`;

	const {
		executionNumber,
		pipeline: { agent, slug: contentSlug },
	} = execution;
	const profileSlug = getProfileSlug(agent);
	const executionURL = buildUrl({ profileSlug, contentSlug, versionNumber: executionNumber });
	const executionLinkText = executionURL.slice(1);

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
				<Paragraph margin={majorScale(2)}>
					Via{" "}
					<Link size={300} href={executionURL}>
						{executionLinkText}
					</Link>
				</Paragraph>
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
