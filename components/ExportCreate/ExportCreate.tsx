import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Button, Checkbox, HTMLSelect, InputGroup, Intent, MenuItem } from "@blueprintjs/core";

import { ExportMappingViewer, Section } from "components";
import { Schema } from "utils/shared/types";

import styles from "./ExportCreate.module.scss";
import { Version } from "@prisma/client";
import { Select } from "@blueprintjs/select";

type Props = {
	newExport: any;
	setNewExport: any;
	collection: any;
	generateExport: any;
	isGenerating: boolean;
};

const ExportCreate: React.FC<Props> = function ({
	newExport,
	setNewExport,
	collection,
	generateExport,
	isGenerating,
}) {
	const lastVersion = collection.versions[0];
	const [activeVersion, setActiveVersion] = useState(lastVersion);
	const schema = collection.schemas[0].content as Schema;
	const schemaNodes = schema.filter((n) => !n.isRelationship);

	useEffect(() => {
		if (!newExport.mapping) {
			const mapping: { [key: string]: any } = {};
			schema.forEach((schemaClass) => {
				const classMap = {
					include: true,
					rename: "",
					attributes: {} as { [key: string]: any },
				};
				schemaClass.attributes.forEach((attr) => {
					classMap.attributes[attr.key] = {
						include: true,
						rename: "",
					};
				});
				mapping[schemaClass.key] = classMap;
			});
			setNewExport({
				...newExport,
				versionId: activeVersion.id,
				mapping: mapping,
			});
		}
	}, []);
	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>1</div>
				<div className={styles.title}>Set Export Format and Options</div>
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<Section className={styles.option} title="Name">
					<InputGroup
						id={"export-name"}
						className="narrow-line-input"
						value={newExport.name}
						onChange={(evt: any) => {
							setNewExport({ ...newExport, name: evt.target.value });
						}}
						placeholder={"Export Name..."}
					/>
				</Section>
				<Section className={styles.option} title="Format">
					<HTMLSelect
						className={styles.select}
						value={newExport.format}
						onChange={(evt) => {
							setNewExport({ ...newExport, format: evt.target.value });
						}}
						options={["JSON", "CSV", "SQL"]}
					/>
				</Section>
				<Section className={styles.option} title="Base Version">
					<Select
						items={collection.versions}
						itemRenderer={(item: Version, { handleClick, modifiers }) => {
							if (!modifiers.matchesPredicate) {
								return null;
							}
							const isSelected = activeVersion?.number === item.number;
							return (
								<MenuItem
									className={isSelected ? "" : styles.menuItem}
									active={modifiers.active}
									key={item.id}
									onClick={handleClick}
									text={item.number}
									icon={isSelected ? "tick" : undefined}
								/>
							);
						}}
						onItemSelect={(item) => {
							/* TODO: Implementation */
							/* When we choose a version on a different schema */
							/* we need to update the mapping */
							setActiveVersion(item);
						}}
						filterable={false}
						popoverProps={{
							minimal: true,
							modifiers: {
								preventOverflow: { enabled: false },
								flip: { enabled: false },
							},
						}}
					>
						<Button outlined rightIcon="caret-down">
							Version {activeVersion.number}
						</Button>
					</Select>
				</Section>
				{/* <Section className={styles.option} title="Privacy">
					<ButtonGroup>
						<Button
							text="Public"
							active={newExport.isPublic === true}
							onClick={() => {
								setNewExport({ ...newExport, isPublic: true });
							}}
						/>
						<Button
							text="Private"
							active={newExport.isPublic !== true}
							onClick={() => {
								setNewExport({ ...newExport, isPublic: false });
							}}
						/>
					</ButtonGroup>
				</Section> */}
			</div>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>2</div>
				<div className={styles.title}>Align Export Data</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				{newExport.format === "CSV" && (
					<div>
						<Section className={styles.option} title="Main node for each CSV row">
							<HTMLSelect
								style={{ marginBottom: "12px" }}
								className={styles.select}
								value={newExport.csvMainNode}
								onChange={(evt) => {
									setNewExport({
										...newExport,
										csvMainNode: evt.target.value,
									});
								}}
								options={schemaNodes.map((n) => n.key)}
							/>
						</Section>
						<Section className={styles.option} title="Node mapping">
							{newExport.mapping &&
								schema.map((schemaClass) => {
									const classIncluded =
										newExport.mapping[schemaClass.key]?.include;
									return (
										<div key={schemaClass.id} className={styles.mappingClass}>
											<div className={styles.classRow}>
												<div className={styles.schemaKey}>
													{schemaClass.key}
												</div>
												<div className={styles.checkbox}>
													<Checkbox
														checked={classIncluded}
														disabled={
															schemaClass.key ===
															newExport.csvMainNode
														}
														label="Include"
														onChange={(evt) => {
															const nextMapping = {
																...newExport.mapping,
															};
															if (nextMapping[schemaClass.key]) {
																nextMapping[
																	schemaClass.key
																].include =
																	// @ts-ignore
																	evt.target.checked;
															} else {
																nextMapping[schemaClass.key] = {
																	// @ts-ignore
																	include: evt.target.checked,
																};
															}
															setNewExport({
																...newExport,
																mapping: nextMapping,
															});
														}}
													/>
												</div>
												{classIncluded && (
													<InputGroup
														className="narrow-line-input"
														placeholder={`Rename...`}
														type="text"
														value={
															newExport.mapping[schemaClass.key]
																?.rename
														}
														onChange={(evt) => {
															const nextMapping = {
																...newExport.mapping,
															};
															nextMapping[schemaClass.key].rename =
																evt.target.value;
															setNewExport({
																...newExport,
																mapping: nextMapping,
															});
														}}
													/>
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
														newExport.mapping[schemaClass.key]
															?.attributes[attr.key]?.include;
													return (
														<div
															key={attr.id}
															className={styles.attrRow}
														>
															<div className={styles.attrKey}>
																{attr.key}
															</div>
															<div className={styles.checkbox}>
																<Checkbox
																	checked={attrIncluded}
																	disabled={!classIncluded}
																	label="Include"
																	onChange={(evt) => {
																		// @ts-ignore
																		const nextMapping = {
																			...newExport.mapping,
																		};

																		nextMapping[
																			schemaClass.key
																		].attributes[
																			attr.key
																			// @ts-ignore
																		].include =
																			// @ts-ignore
																			evt.target.checked;
																		setNewExport({
																			...newExport,
																			mapping: nextMapping,
																		});
																	}}
																/>
															</div>
															{attrIncluded && classIncluded && (
																<InputGroup
																	className="narrow-line-input"
																	placeholder={`Rename...`}
																	type="text"
																	value={
																		newExport.mapping[
																			schemaClass.key
																		]?.attributes[attr.key]
																			.rename
																	}
																	onChange={(evt) => {
																		const nextMapping = {
																			...newExport.mapping,
																		};
																		nextMapping[
																			schemaClass.key
																		].attributes[
																			attr.key
																		].rename = evt.target.value;
																		setNewExport({
																			...newExport,
																			mapping: nextMapping,
																		});
																	}}
																/>
															)}
														</div>
													);
												})}
										</div>
									);
								})}
						</Section>
						<Section className={styles.option} title="Preview">
							<pre>
								<code>
									CSV Rows:
									<br />
									<br />
									{getCSVHeaderRow(newExport).join(" | ")}
								</code>
							</pre>
						</Section>
					</div>
				)}

				{newExport.format === "JSON" && newExport.mapping && (
					<div>
						<ExportMappingViewer
							targetExport={newExport}
							setNewExport={setNewExport}
							collection={collection}
							editable={true}
						/>

						<Section className={styles.option} title="Preview">
							<pre>
								<code>
									JSON Shape:
									<br />
									<br />
									{getJSONPreview(newExport)}
								</code>
							</pre>
						</Section>
					</div>
				)}
			</div>

			<div className={styles.sectionHeader}>
				<div className={styles.number}>3</div>
				<div className={styles.title}>Generate Export</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				<p>
					Description about generating an export does goes here. We can explain versions,
					how they're used, etc
				</p>
				<Button
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text="Generate Export"
					onClick={generateExport}
					loading={isGenerating}
					disabled={!newExport?.name}
				/>
			</div>
		</div>
	);
};

export default ExportCreate;

function getCSVHeaderRow(newExport: any) {
	const { mapping, csvMainNode } = newExport;

	const mainNodeColumns = [];
	const otherNodeColumns = [];

	for (let k in mapping) {
		if (k === csvMainNode) {
			for (let a in mapping[k].attributes) {
				const attr = mapping[k].attributes[a];
				if (attr.include) {
					mainNodeColumns.push(`${k}/${attr.rename ? attr.rename : a}`);
				}
			}
		} else {
			if (mapping[k].include) {
				for (let a in mapping[k].attributes) {
					const attr = mapping[k].attributes[a];
					if (attr.include && a !== "source" && a !== "target") {
						otherNodeColumns.push(`${k}/${attr.rename ? attr.rename : a}`);
					}
				}
			}
		}
	}

	return [...mainNodeColumns, ...otherNodeColumns];
}

function getJSONPreview(newExport: any) {
	const { mapping } = newExport;

	const result: any = {};

	for (let k in mapping) {
		if (!result[k]) {
			result[k] = [];
		}

		for (let a in mapping[k].attributes) {
			const attr = mapping[k].attributes[a];
			if (attr.include && a !== "source" && a !== "target") {
				const key = attr.rename || a;
				result[k].push({
					[key]: "some value",
				});
			}
		}
		result[k].push("<TRIPLE_DOT_PLACEHOLDER>");
	}

	return JSON.stringify(result, null, 2).replace(/"<TRIPLE_DOT_PLACEHOLDER>"/g, "...");
}
