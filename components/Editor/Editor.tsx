import React, { useState } from "react";
import classNames from "classnames";
import { Button, ButtonGroup, InputGroup } from "@blueprintjs/core";
import SchemaEditor from "./SchemaEditor";

import styles from "./Editor.module.scss";
import { Discussion, Provenance, Schema } from "components/Icons";
import { Add } from "@blueprintjs/icons";
import type { Entity, Node } from "./data";

export type SchemaData = {
	data: {
		schemaNodeJson: string;
		relationshipJson: string;
		entityJson: string;
	};
};

const classBlock = (item, isRelationship, classClick, schemaClick, showSchema) => {
	return (
		<div
			key={item.id}
			className={classNames(
				styles.node,
				isRelationship && styles.relationship,
				!showSchema && styles.narrowWidth
			)}
			onClick={classClick}
		>
			<div className={styles.key}>
				<div className={styles.namespace}>{item.namespace}</div>
				<div className={styles.name}>{item.id}</div>
			</div>
			{showSchema && <Button minimal icon={<Schema />} onClick={schemaClick} />}
		</div>
	);
};

const Editor: React.FC<SchemaData> = function ({ data }) {
	const initialNodes: Node[] = JSON.parse(data.schemaNodeJson);
	const relationships: Node[] = JSON.parse(data.relationshipJson);
	const entities: Entity[] = JSON.parse(data.entityJson);

	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [filterVal, setFilterVal] = useState<string>("");

	const [activeNodeIndexes, setActiveNodeIndexes] = useState<number[]>([]);
	const [activeRelationshipIndexes, setActiveRelationshipIndexes] = useState<number[]>([]);

	const [activeFilters, setActiveFilters] = useState([]);
	const [mode, setMode] = useState<"entities" | "schema">("entities");

	let tempNode: Node = {
		id: "",
		namespace: "",
		fields: [],
	};

	// remove
	const [activeNodes, setActiveNodes] = useState([]);

	function getActiveNodes(): [Node, number][] {
		return activeNodeIndexes.map((i) => [nodes[i], i]);
	}
	function getActiveRelationships() {
		return activeRelationshipIndexes.map((i) => relationships[i]);
	}

	const filterColumnItems = (index: number, item: Entity) => {
		if (index === 0) {
			return true;
		}
		const currentFilter = activeFilters[index - 1];
		return (
			item.id === currentFilter ||
			item.source === currentFilter ||
			item.target === currentFilter
		);
	};
	const findEntityById = (id) => {
		const flatEntities = Object.values(entities).reduce((prev, curr) => {
			return prev.concat(curr);
		}, []);
		return flatEntities.find((item) => {
			return item.id === id;
		});
	};

	const findNodeType = (id) => {
		const typeMap = {
			e: "employedAt",
			a: "authored",
			gdf: "gotDegreeFrom",
			pub: "Publication",
			i: "Institution",
			p: "Person",
		};
		return nodes.find((node) => {
			return node.id === typeMap[id.replace(/[0-9]/g, "")];
		});
	};

	const findPropertyNamespace = (property, nodeId) => {
		const entityThing = nodes.concat(relationships).find((entity) => {
			return entity.id === nodeId;
		});
		const fieldThing = entityThing?.fields.find((field) => {
			return field.id === property;
		});
		return fieldThing?.namespace;
	};

	return (
		<div>
			<div className={styles.editor}>
				<div className={styles.side}>
					<InputGroup
						asyncControl={true}
						leftIcon="filter"
						onChange={(evt) => {
							setFilterVal(evt.target.value);
						}}
						placeholder="Filter..."
						value={filterVal}
					/>

					<div className={styles.title}>Nodes</div>
					{nodes
						.filter((item) => {
							return (
								!filterVal ||
								item.id.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
							);
						})
						.map((node, nodeIndex) => {
							return classBlock(
								node,
								false,
								() => {
									setActiveNodeIndexes([nodeIndex]);
									setActiveRelationshipIndexes([]);
									setActiveFilters([]);
									setMode("entities");
								},
								(evt) => {
									setActiveNodeIndexes([nodeIndex]);
									setMode("schema");
									evt.stopPropagation();
								},
								true
							);
						})}

					<div
						key={"addNodes"}
						className={classNames(styles.node)}
						onClick={(ev) => {
							const newActiveIndex = nodes.length;
							setNodes([
								...nodes,
								{
									id: "NewNodeName",
									namespace: "./",
									fields: [],
								},
							]);
							setActiveNodeIndexes([newActiveIndex]);
							setMode("schema");
						}}
					>
						<div className={styles.key}>
							<div className={styles.name}>Add Node</div>
						</div>
						<Button minimal icon={<Add />} />
					</div>

					<div className={styles.title}>Relationships</div>
					{relationships
						.filter((item) => {
							return (
								!filterVal ||
								item.id.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
							);
						})
						.map((relationship, relationshipIndex) => {
							return classBlock(
								relationship,
								true,
								() => {
									setActiveRelationshipIndexes([relationshipIndex]);
									setActiveNodeIndexes([]);
									setMode("entities");
								},
								(evt) => {
									setActiveRelationshipIndexes([relationshipIndex]);
									setActiveNodeIndexes([]);
									setMode("schema");
									evt.stopPropagation();
								},
								true
							);
						})}
				</div>

				<div className={styles.columns}>
					{/* {mode === "schema" &&
            <SchemaEditor node={nodes[activeNodeIndexes[0]]} onCommit={() => {}} />
          } */}

					{getActiveNodes().map((args) => {
						const [node, nodeIndex] = args;

						if (mode === "schema") {
							tempNode = { ...node };
							function commitTempNode() {
								setNodes([
									...nodes.slice(0, nodeIndex),
									tempNode,
									...nodes.slice(nodeIndex + 1),
								]);
							}

							return (
								<div className={styles.column} key={node.id}>
									<div className={styles.contentHeader}>
										<div className={styles.namespace}>{node.namespace}</div>
										<InputGroup
											placeholder="Class..."
											asyncControl={true}
											value={tempNode.id}
											large
											key={"class" + nodeIndex.toString()}
											onChange={(event) => {
												tempNode.id = event.target.value;
											}}
										/>
									</div>

									{tempNode.fields.map((field, fieldIndex) => {
										return (
											<div key={field.id} className={styles.schemaRow}>
												<div className={styles.namespace}>
													{field.namespace}
												</div>
												<div className={styles.schemaRowContent}>
													<DragHandleHorizontal
														style={{ opacity: 0.6 }}
													/>
													<InputGroup
														placeholder="Key..."
														asyncControl={true}
														value={field.id}
														onChange={(event) => {
															tempNode.fields[fieldIndex].id =
																event.target.value;
														}}
													/>

													<HTMLSelect
														key="type"
														value={field.type}
														onChange={(event) => {
															tempNode.fields[fieldIndex].type = event
																.target.value as any;
															commitTempNode();
														}}
													>
														<option value="string">string</option>
														<option value="number">number</option>
														<option value="boolean">boolean</option>
													</HTMLSelect>

													<ButtonGroup>
														<Button
															text="Optional"
															active={!field.isRequired}
															onClick={() => {
																tempNode.fields[
																	fieldIndex
																].isRequired = false;
																commitTempNode();
															}}
														/>
														<Button
															text="Required"
															active={field.isRequired}
															onClick={() => {
																tempNode.fields[
																	fieldIndex
																].isRequired = true;
																commitTempNode();
															}}
														/>
													</ButtonGroup>
												</div>
											</div>
										);
									})}

									<div>
										<ButtonGroup>
											<Button
												text="Add Field"
												onClick={(ev) => {
													tempNode.fields.push({
														id: "New Node",
														namespace: "./",
														type: "string",
														isRequired: true,
														allowMultiple: false,
													});
													commitTempNode();
												}}
											/>
										</ButtonGroup>
									</div>

									<div>
										<ButtonGroup className={styles.rightButton}>
											<Button
												text="Cancel"
												onClick={(ev) => {
													setMode("entities");
												}}
											/>
											<Button
												text="Commit"
												onClick={(ev) => {
													commitTempNode();
												}}
											/>
										</ButtonGroup>
									</div>
								</div>
							);
						}

						return (
							<div className={styles.column} key={`${node.id}${nodeIndex}`}>
								<div className={styles.contentHeader}>
									{classBlock(
										node,
										node.fields[0]?.id === "source",
										() => {},
										() => {},
										false
									)}
								</div>
								{(entities[node.id] || [])
									.filter((item) => {
										return filterColumnItems(nodeIndex, item);
									})
									.map((item) => {
										const existingRelationships: any = {};
										Object.keys(entities).map((entityKey) => {
											const links = entities[entityKey].reduce(
												(prev, curr) => {
													if (
														curr.source === item.id ||
														curr.target === item.id
													) {
														return prev.concat(curr);
													}
													return prev;
												},
												[]
											);
											if (links.length) {
												existingRelationships[entityKey] = links;
											}
										});
										return (
											<div key={item.id} className={styles.entityCard}>
												<div className={styles.topIcons}>
													<ButtonGroup>
														<Button minimal icon={<Provenance />} />
														<Button
															minimal
															icon={<Discussion size={20} />}
														/>
													</ButtonGroup>
												</div>
												{Object.keys(item).map((property) => {
													const propertyNamespace = findPropertyNamespace(
														property,
														node.id
													);
													if (property === "id") {
														return null;
													}
													if (property === "source") {
														const currNode = findEntityById(
															item[property]
														);
														const nodeType = findNodeType(
															item[property]
														);
														return (
															<div>
																<div
																	className={
																		styles.propertyWrapper
																	}
																>
																	<div
																		className={
																			styles.propertyHeader
																		}
																	>
																		<div
																			className={
																				styles.namespace
																			}
																		>
																			{propertyNamespace}
																		</div>
																		Source:{" "}
																	</div>

																	<Button
																		text={
																			currNode.name ||
																			currNode.title
																		}
																		onClick={() => {
																			setActiveNodes(
																				activeNodes
																					.slice(
																						0,
																						nodeIndex +
																							1
																					)
																					.concat(
																						nodeType
																					)
																			);
																			setActiveFilters(
																				activeFilters
																					.slice(
																						0,
																						nodeIndex
																					)
																					.concat(
																						item[
																							property
																						]
																					)
																			);
																		}}
																	/>
																</div>
															</div>
														);
													}
													if (property === "target") {
														const currNode = findEntityById(
															item[property]
														);
														const nodeType = findNodeType(
															item[property]
														);
														return (
															<div>
																<div
																	className={
																		styles.propertyWrapper
																	}
																>
																	<div
																		className={
																			styles.propertyHeader
																		}
																	>
																		<div
																			className={
																				styles.namespace
																			}
																		>
																			{propertyNamespace}
																		</div>
																		Target:{" "}
																	</div>
																	<Button
																		text={
																			currNode.name ||
																			currNode.title
																		}
																		onClick={() => {
																			setActiveNodes(
																				activeNodes
																					.slice(
																						0,
																						nodeIndex +
																							1
																					)
																					.concat(
																						nodeType
																					)
																			);
																			setActiveFilters(
																				activeFilters
																					.slice(
																						0,
																						nodeIndex
																					)
																					.concat(
																						item[
																							property
																						]
																					)
																			);
																		}}
																	/>
																</div>
															</div>
														);
													}
													return (
														<div>
															<div className={styles.propertyWrapper}>
																<div
																	className={
																		styles.propertyHeader
																	}
																>
																	<div
																		className={styles.namespace}
																	>
																		{propertyNamespace}
																	</div>
																	{property}:
																</div>
																{item[property]}
															</div>
														</div>
													);
												})}
												{Object.keys(existingRelationships).length > 0 && (
													<div>
														<div className={styles.title}>
															Relationships
														</div>
														{Object.keys(existingRelationships).map(
															(key) => {
																const targetRelationshipIndex =
																	relationships.findIndex(
																		(rel) => {
																			return rel.id === key;
																		}
																	);
																const targetRelationship =
																	relationships[
																		targetRelationshipIndex
																	];

																return (
																	<div className={styles.small}>
																		{classBlock(
																			targetRelationship,
																			true,
																			() => {
																				if (
																					!activeRelationshipIndexes.includes(
																						targetRelationshipIndex
																					)
																				) {
																					setActiveRelationshipIndexes(
																						[
																							...activeRelationshipIndexes,
																							targetRelationshipIndex,
																						]
																					);
																				}
																				// setActiveNodes(
																				// 	activeNodes
																				// 		.slice(
																				// 			0,
																				// 			index +
																				// 				1
																				// 		)
																				// 		.concat(
																				// 			targetRelationshipIndex
																				// 		)
																				// );
																				setActiveFilters(
																					activeFilters
																						.slice(
																							0,
																							nodeIndex
																						)
																						.concat(
																							item.id
																						)
																				);
																			},
																			undefined,
																			false
																		)}
																	</div>
																);
															}
														)}
													</div>
												)}
											</div>
										);
									})}
							</div>
						);
					})}
				</div>
			</div>
			<Button
				style={{ marginTop: "20px", marginBottom: "20px" }}
				text="Upload Schema"
				className={styles.rightButton}
				onClick={async (event) => {
					await fetch("/api/schema", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							schemaNodeJson: JSON.stringify(nodes),
							relationshipJson: JSON.stringify(relationships),
							entityJson: JSON.stringify(entities),
						}),
					});
				}}
			/>
		</div>
	);
};

export default Editor;
