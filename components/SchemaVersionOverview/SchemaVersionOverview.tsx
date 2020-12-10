import React, { useMemo } from "react";
import { majorScale, Pane, Paragraph } from "evergreen-ui";

import { Section, SchemaViewer, ReadmeViewer } from "components";
import { SchemaVersionProps } from "utils/shared/propTypes";
import { parseSchema } from "utils/shared/schemas/parse";
import SchemaGraph from "components/SchemaGraph/SchemaGraph";

export type SchemaVersionOverviewProps = SchemaVersionProps;

const SchemaVersionOverview: React.FC<SchemaVersionOverviewProps> = ({
	versionNumber,
	content,
	readme,
	createdAt,
}) => {
	const date = new Date(createdAt);
	const result = useMemo(() => parseSchema(content), [content]);
	const schema = result._tag === "Left" ? null : result.right.schema;
	const namespaces = result._tag === "Left" ? {} : result.right.namespaces;

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
				<SchemaViewer marginY={majorScale(2)} value={content} />
				<SchemaGraph marginY={majorScale(2)} schema={schema} namespaces={namespaces} />
			</Section>
		</React.Fragment>
	);
};

export default SchemaVersionOverview;
