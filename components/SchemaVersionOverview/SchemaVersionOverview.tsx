import React, { useMemo } from "react";
import { Pane, Paragraph } from "evergreen-ui";

import { Section, SchemaContent, SchemaGraph, ReadmeViewer } from "components";
import { parseToml, toOption } from "utils/shared/schemas/parse";

interface SchemaVersionOverviewProps {
	// id: string;
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
}

const SchemaVersionOverview: React.FC<SchemaVersionOverviewProps> = ({
	// id,
	versionNumber,
	content,
	readme,
	createdAt,
}) => {
	const result = useMemo(() => toOption(parseToml(content)), []);
	const date =  new Date(createdAt);
	return (
		<React.Fragment>
			<Section title={<span>v{versionNumber} · {date.toLocaleDateString()}<br />README</span>} useMargin useUppercase={false}>
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

			<Section title="Graph" useMargin>
				<Pane>{result._tag === "Some" && <SchemaGraph schema={result.value} />}</Pane>
			</Section>

			<Section title="File" useMargin>
				<SchemaContent initialValue={content} readOnly={true} />
			</Section>
		</React.Fragment>
	);
};
export default SchemaVersionOverview;
