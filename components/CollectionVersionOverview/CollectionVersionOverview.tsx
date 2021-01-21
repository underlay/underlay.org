import React from "react";
import { Pane, Paragraph } from "evergreen-ui";

import { Section, ReadmeViewer } from "components";
import { CollectionVersionProps } from "utils/shared/propTypes";

export type CollectionVersionOverviewProps = CollectionVersionProps;

const SchemaVersionOverview: React.FC<CollectionVersionOverviewProps> = ({
	versionNumber,
	readme,
	createdAt,
}) => {
	const date = new Date(createdAt);

	return (
		<React.Fragment>
			<Section
				title={
					<span>
						v{versionNumber} · {date.toLocaleDateString()}
						<br />
						README
					</span>
				}
				useMargin
				useUppercase={false}
			>
				<Pane>
					{readme === null ? (
						<Paragraph fontStyle="italic" color="muted">
							No readme
						</Paragraph>
					) : (
						<ReadmeViewer source={readme} />
					)}
				</Pane>
			</Section>
		</React.Fragment>
	);
};

export default SchemaVersionOverview;
