import React from "react";
import { Checkbox, InputGroup } from "@blueprintjs/core";

import { Section } from "components";
import { Schema } from "utils/shared/types";

import styles from "./ExportMappingViewer.module.scss";

type Props = {
	targetExport: any;
	setNewExport: any;
	collection: any;
	editable: boolean;
};

const ExportMappingViewer: React.FC<Props> = function ({
	targetExport: targetExport,
	setNewExport,
	collection,
	editable,
}) {
	const schema = collection.schemas[0].content as Schema;

	return (
		<div className={styles.mappingViewer}>
			<Section className={styles.option} title="JSON Key Mapping">
				{schema.map((schemaClass) => {
					const classIncluded = targetExport.mapping[schemaClass.key]?.include;
					return (
						<div key={schemaClass.id} className={styles.mappingClass}>
							<div className={styles.classRow}>
								<div className={styles.schemaKey}>{schemaClass.key}</div>
								<div className={styles.checkbox}>
									<Checkbox
										checked={classIncluded}
										label="Include"
										disabled={!editable}
										onChange={(evt) => {
											const nextMapping = {
												...targetExport.mapping,
											};
											if (nextMapping[schemaClass.key]) {
												nextMapping[schemaClass.key].include =
													// @ts-ignore
													evt.target.checked;
											} else {
												nextMapping[schemaClass.key] = {
													// @ts-ignore
													include: evt.target.checked,
												};
											}
											setNewExport({
												...targetExport,
												mapping: nextMapping,
											});
										}}
									/>
								</div>
								{editable && classIncluded && (
									<InputGroup
										className="narrow-line-input"
										placeholder={`Rename...`}
										type="text"
										value={targetExport.mapping[schemaClass.key]?.rename}
										disabled={!editable}
										onChange={(evt) => {
											const nextMapping = {
												...targetExport.mapping,
											};
											nextMapping[schemaClass.key].rename = evt.target.value;
											setNewExport({
												...targetExport,
												mapping: nextMapping,
											});
										}}
									/>
								)}
								{!editable && classIncluded && (
									<span>{targetExport.mapping[schemaClass.key]?.rename}</span>
								)}
							</div>
							{schemaClass?.attributes
								.filter((a) => {
									if (!schemaClass.isRelationship) {
										return true;
									}

									return a.key !== "source" && a.key !== "target";
								})
								.map((attr) => {
									const attrIncluded =
										targetExport.mapping[schemaClass.key]?.attributes[attr.key]
											?.include;
									return (
										<div key={attr.id} className={styles.attrRow}>
											<div className={styles.attrKey}>{attr.key}</div>
											<div className={styles.checkbox}>
												<Checkbox
													checked={attrIncluded}
													disabled={!classIncluded || !editable}
													label="Include"
													onChange={(evt) => {
														// @ts-ignore
														const nextMapping = {
															...targetExport.mapping,
														};

														nextMapping[schemaClass.key].attributes[
															attr.key
															// @ts-ignore
														].include = evt.target.checked;
														setNewExport({
															...targetExport,
															mapping: nextMapping,
														});
													}}
												/>
											</div>
											{editable && attrIncluded && classIncluded && (
												<InputGroup
													className="narrow-line-input"
													placeholder={`Rename...`}
													type="text"
													value={
														targetExport.mapping[schemaClass.key]
															?.attributes[attr.key].rename
													}
													disabled={!editable}
													onChange={(evt) => {
														const nextMapping = {
															...targetExport.mapping,
														};
														nextMapping[schemaClass.key].attributes[
															attr.key
														].rename = evt.target.value;
														setNewExport({
															...targetExport,
															mapping: nextMapping,
														});
													}}
												/>
											)}
											{!editable && attrIncluded && classIncluded && (
												<span>
													{
														targetExport.mapping[schemaClass.key]
															?.attributes[attr.key].rename
													}
												</span>
											)}
										</div>
									);
								})}
						</div>
					);
				})}
			</Section>
		</div>
	);
};

export default ExportMappingViewer;
