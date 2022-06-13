import { HTMLSelect, Icon } from "@blueprintjs/core";

import { Schema } from "utils/shared/types";

import styles from "./DataMapping.module.scss";

type Props = {
	schema: Schema;
	csvHeaders: string[];
	mapping: any;
	setMapping: (mapping: any) => any;
};

const DataMapping: React.FC<Props> = function ({ schema, csvHeaders, mapping = [], setMapping }) {
	// File not selected or invalid file;
	const disabled = csvHeaders.length === 0;

	return (
		<div>
			{schema.map((schemaClass) => {
				return (
					<div key={schemaClass.id} className={styles.classBlock}>
						<div className={styles.classKey}>{schemaClass.key}</div>
						{schemaClass.attributes
							.filter((_attr, index) => {
								return !schemaClass.isRelationship || index >= 2;
							})
							.map((attr) => {
								const existingMappedEntry = mapping.find((mapEntry: any) => {
									return (
										mapEntry.class === schemaClass.key &&
										mapEntry.attr === attr.key
									);
								});
								const selectedValue = existingMappedEntry?.csvHeader;
								return (
									<div key={attr.id} className={styles.attrBlock}>
										<div className={styles.attrKey}>{attr.key}</div>
										<Icon
											className={styles.attrArrow}
											icon="arrows-horizontal"
										/>
										<HTMLSelect
											className={styles.select}
											value={selectedValue}
											// minimal
											onChange={(evt) => {
												const newValue = evt.target.value;
												const newMapping = mapping.filter(
													(mapEntry: any) => {
														return (
															mapEntry.class !== schemaClass.key ||
															mapEntry.attr !== attr.key
														);
													}
												);
												if (newValue) {
													newMapping.push({
														class: schemaClass.key,
														attr: attr.key,
														csvHeader: newValue,
													});
												}

												setMapping(newMapping);
											}}
											disabled={disabled}
										>
											<option value={""}>None</option>
											{csvHeaders.map((header) => {
												return (
													<option key={header} value={header}>
														{header}
													</option>
												);
											})}
										</HTMLSelect>
									</div>
								);
							})}
					</div>
				);
			})}
		</div>
	);
};

export default DataMapping;
