import React from "react";
import { Pane, Paragraph } from "evergreen-ui";

import { Section, SchemaEditor, ReadmeViewer } from "components";

export interface SchemaVersionOverviewProps {
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
}

const SchemaVersionOverview: React.FC<SchemaVersionOverviewProps> = ({
	versionNumber,
	content,
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

			<Section title="Content" useMargin>
				<SchemaEditor initialValue={content} readOnly={true} />
			</Section>
		</React.Fragment>
	);
};

export default SchemaVersionOverview;
