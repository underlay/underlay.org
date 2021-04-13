import React, { memo } from "react";

import type { ValidationError } from "@underlay/pipeline";
import { Code, Heading, majorScale, Pane, Paragraph, Text } from "evergreen-ui";

export interface ValidationReportProps {
	errors: ValidationError[];
}

const ValidationReport: React.FC<ValidationReportProps> = (props) => {
	return (
		<>
			{props.errors.map((error, index) => (
				<Pane key={index} border background="redTint" marginY={majorScale(2)}>
					{renderValidationError(error)}
				</Pane>
			))}
		</>
	);
};

function renderValidationError(error: ValidationError) {
	if (error.type === "validate/graph") {
		return (
			<>
				<Heading margin={majorScale(2)}>Graph error</Heading>
				<Paragraph margin={majorScale(2)}>{error.message}</Paragraph>
			</>
		);
	} else if (error.type === "validate/node") {
		return (
			<>
				<Pane margin={majorScale(2)} display="flex" alignItems="center">
					<Heading flex={1}>Node error</Heading>
					<Code size={300}>#{error.id}</Code>
				</Pane>
				<Paragraph margin={majorScale(2)}>
					<Text>{error.message}</Text>
				</Paragraph>
			</>
		);
	} else if (error.type === "validate/edge") {
		return (
			<>
				<Pane margin={majorScale(2)} display="flex" alignItems="center">
					<Heading flex={1}>Edge error</Heading>
					<Code size={300}>#{error.id}</Code>
				</Pane>
				<Paragraph margin={majorScale(2)}>
					<Code size={300}>#{error.id}</Code> - <Text>{error.message}</Text>
				</Paragraph>
			</>
		);
	} else {
		return null;
	}
}

export default memo(ValidationReport);
