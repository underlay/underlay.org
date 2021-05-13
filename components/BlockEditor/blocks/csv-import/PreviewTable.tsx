import React, { memo } from "react";

import { Table } from "evergreen-ui";

export interface PreviewTableProps {
	focus: number;
	header: boolean;
	data: string[][];
	setFocus: (focus: number) => void;
}

const PreviewTableHeader: React.FC<PreviewTableProps> = (props: PreviewTableProps) => {
	if (props.header && props.data.length > 0) {
		const [row] = props.data;
		return (
			<Table.Head>
				{row.map((value, j) => (
					<Table.TextHeaderCell
						key={j}
						onMouseEnter={() => props.setFocus(j)}
						backgroundColor={j === props.focus ? "powderblue" : undefined}
					>
						{value}
					</Table.TextHeaderCell>
				))}
			</Table.Head>
		);
	} else {
		return null;
	}
};

const PreviewTable: React.FC<PreviewTableProps> = (props: PreviewTableProps) => {
	const rows = props.header ? props.data.slice(1) : props.data;
	return (
		<Table border="muted">
			<PreviewTableHeader {...props} />
			<Table.Body>
				{rows.map((row, i) => (
					<Table.Row key={i}>
						{row.map((value, j) => (
							<Table.TextCell
								key={j}
								onMouseEnter={() => props.setFocus(j)}
								background={j === props.focus ? "tealTint" : undefined}
							>
								{value}
							</Table.TextCell>
						))}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
};

export default memo(PreviewTable);
