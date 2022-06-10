import { HTMLSelect } from "@blueprintjs/core";
import React, { useState } from "react";
import { Schema } from "utils/shared/types";

import styles from "./DataMapping.module.scss";

const DEFAULT_HEADER = "Select Column";

type Props = {
	schema: Schema;
	csvHeaders: string[];
	onMappingChange: (mapping: any) => any;
	onMappingCompleted: () => any;
};

const DataMapping: React.FC<Props> = function ({
	schema,
	csvHeaders,
	onMappingChange,
	onMappingCompleted,
}) {
	// File not selected yet
	const disabled = csvHeaders.length === 0;

	const schemaAttributesToMap: string[] = [];
	schema.forEach((c) => {
		c.attributes.forEach((a) => {
			if (c.isRelationship && (a.key === "source" || a.key === "target")) {
				return;
			}
			schemaAttributesToMap.push(`${c.key} - ${a.key}`);
		});
	});

	const [mappedHeaders, setMappedHeaders] = useState(
		schemaAttributesToMap.map((_a) => DEFAULT_HEADER)
	);

	const updateMappedHeaders = (i: number) => (e: any) => {
		const newArr = [...mappedHeaders];
		newArr[i] = e.target.value;
		setMappedHeaders(newArr);
		onMappingChange(newArr);

		// TODO: We should not require all fields to be completed.
		// But not exactly sure where in the flow to fix.
		// Commenting out for now...
		// if (newArr.filter((o) => o === DEFAULT_HEADER).length === 0) {
		onMappingCompleted();
		// }
	};

	return (
		<div>
			{disabled && (
				<p>
					<i>Please select a file</i>
				</p>
			)}
			{schemaAttributesToMap.map((aName, i) => {
				return (
					<div style={{ marginBottom: "8px" }}>
						<HTMLSelect
							className={styles.select}
							value={undefined}
							onChange={updateMappedHeaders(i)}
							disabled={disabled}
						>
							<option value={""}>{mappedHeaders[i]}</option>
							{csvHeaders.map((header) => {
								return (
									<option key={header} value={header}>
										{header}
									</option>
								);
							})}
						</HTMLSelect>
						<span style={{ marginLeft: "12px" }}>{aName}</span>
					</div>
				);
			})}
		</div>
	);
};

export default DataMapping;
