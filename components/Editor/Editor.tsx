import React, { useState } from "react";
import classNames from "classnames";
import { Button, ButtonGroup, InputGroup } from "@blueprintjs/core";
import SchemaEditor from "../SchemaEditor/SchemaEditor";
import NodeOrRelationshipBlock from "./NodeOrRelationshipBlock";

import styles from "./Editor.module.scss";
import { Discussion, Provenance } from "components/Icons";
import { Add } from "@blueprintjs/icons";
import type { Entity, Node } from "./data";
import { pushToArrayIfUnseen, updateArrayWithNewElement } from "utils/shared/arrays";
import EntityCard from "components/EntityCard/EntityCard";
import EntityRelationships from "components/EntityCard/EntityRelationships";

export type SchemaData = {
	data: {
		schemaNodeJson: string;
		relationshipJson: string;
		entityJson: string;
	};
};

const Editor: React.FC<SchemaData> = function ({ data }) {
	const initialNodes: Node[] = JSON.parse(data.schemaNodeJson);
	const relationships: Node[] = JSON.parse(data.relationshipJson);
	const allEntities: { [key: string]: Entity[] } = JSON.parse(data.entityJson);

	const [nodes, setNodes] = useState<Node[]>(initialNodes);
	const [filterVal, setFilterVal] = useState<string>("");

	const [activeNodeIndexes, setActiveNodeIndexes] = useState<number[]>([]);
	const [activeRelationshipIndexes, setActiveRelationshipIndexes] = useState<number[]>([]);

	const [activeFilters, setActiveFilters] = useState([]);
	const [mode, setMode] = useState<"entities" | "schema">("entities");

	// remove
	const [activeNodes, setActiveNodes] = useState([]);

	function getActiveNodes(): [Node, number][] {
		return activeNodeIndexes.map((i) => [nodes[i], i]);
	}
	function getActiveRelationships() {
		return activeRelationshipIndexes.map((i) => relationships[i]);
	}
	function getActiveEntities() {
		const activeNodeEntities = activeNodeIndexes
			.map((i) => nodes[i])
			.filter((n) => n.id in allEntities)
			.map((n) => {
				return {
					node: n,
					entities: allEntities[n.id],
				};
			});

		const activeRelationshipEntities = activeRelationshipIndexes
			.map((i) => relationships[i])
			.filter((r) => r.id in allEntities)
			.map((r) => {
				return {
					relationship: r,
					entities: allEntities[r.id],
				};
			});

		return [...activeNodeEntities, ...activeRelationshipEntities];
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
		const flatEntities = Object.values(allEntities).reduce((prev, curr) => {
			return prev.concat(curr);
		}, []);
		return flatEntities.find((item) => {
			return item.id === id;
		});
	};

	const findNodeType = (id) => {
		const typeMap: { [key: string]: string } = {
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
							return (
								<NodeOrRelationshipBlock
									node={node}
									isRelationship={false}
									classClick={() => {
										setActiveNodeIndexes([nodeIndex]);
										setActiveRelationshipIndexes([]);
										setActiveFilters([]);
										setMode("entities");
									}}
									schemaClick={(ev) => {
										setActiveNodeIndexes([nodeIndex]);
										setMode("schema");
										ev.stopPropagation();
									}}
									showSchema={true}
								/>
							);
						})}

					<div
						key={"addNodes"}
						className={classNames(styles.node)}
						onClick={() => {
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
							return (
								<NodeOrRelationshipBlock
									node={relationship}
									isRelationship={true}
									classClick={() => {
										setActiveRelationshipIndexes([relationshipIndex]);
										setActiveNodeIndexes([]);
										setMode("entities");
									}}
									schemaClick={(ev) => {
										setActiveRelationshipIndexes([relationshipIndex]);
										setActiveNodeIndexes([]);
										setMode("schema");
										ev.stopPropagation();
									}}
									showSchema={true}
								/>
							);
						})}
				</div>

				<div className={styles.columns}>
					{mode === "schema" && (
						<SchemaEditor
							node={nodes[activeNodeIndexes[0]]}
							onCancel={() => {
								setMode("entities");
							}}
							onCommit={(node) => {
								setNodes(
									updateArrayWithNewElement(nodes, activeNodeIndexes[0], node)
								);
							}}
						/>
					)}

					{mode === "entities" &&
						getActiveEntities().map((args) => {
							const nodeOrRelationship =
								"node" in args ? args.node : args.relationship;

							const header = (
								<div className={styles.contentHeader}>
									<NodeOrRelationshipBlock
										node={nodeOrRelationship}
										isRelationship={
											nodeOrRelationship.fields[0]?.id === "source"
										}
										showSchema={false}
									/>
								</div>
							);

							return (
								<div
									className={styles.column}
									key={`${nodeOrRelationship.id}Entities`}
								>
									{header}

									{args.entities.map((entity) => {
										/**
										 * keyed by relationship name such as `authored`
										 * values are relationship's ID and related entities
										 */
										const relatedEntities: {
											[key: string]: Entity[];
										} = {};
										Object.keys(allEntities).map((entityKey) => {
											const links = allEntities[entityKey].filter((e) => {
												return (
													e.source === entity.id || e.target === entity.id
												);
											});
											if (links.length) {
												relatedEntities[entityKey] = links;
											}
										});

										/**
										 * rendering entities of a node
										 */
										if ("node" in args) {
											const relationshipAndIndexes = Object.keys(
												relatedEntities
											).map((relName) => {
												const relationship = relationships.find(
													(r) => r.id === relName
												)!;
												const relationshipIndex = relationships.findIndex(
													(r) => r.id === relName
												);
												return {
													relationship,
													relationshipIndex,
												};
											});
											const relationshipRendering = (
												<EntityRelationships
													relationshipAndIndexes={relationshipAndIndexes}
													onRelationshipClick={(relationshipIndex) => {
														setActiveRelationshipIndexes(
															pushToArrayIfUnseen(
																activeRelationshipIndexes,
																relationshipIndex
															)
														);
													}}
												/>
											);
											return (
												<EntityCard
													entity={entity}
													node={args.node}
													relationshipRendering={relationshipRendering}
												/>
											);
										} else {
											/**
											 * rendering entities of a relationship
											 */
										}
										return (
											<div key={entity.id} className={styles.entityCard}>
												<div className={styles.topIcons}>
													<ButtonGroup>
														<Button minimal icon={<Provenance />} />
														<Button
															minimal
															icon={<Discussion size={20} />}
														/>
													</ButtonGroup>
												</div>

												{Object.keys(entity).map((property) => {
													const propertyNamespace =
														nodeOrRelationship.fields.find(
															(f) => f.id === property
														)?.namespace;
													if (property === "id") {
														return null;
													}
													if (property === "source") {
														const currNode = findEntityById(
															entity[property]
														);
														const nodeType = findNodeType(
															entity[property]
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
																						entity[
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
															entity[property]
														);
														const nodeType = findNodeType(
															entity[property]
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
																						entity[
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
																{entity[property]}
															</div>
														</div>
													);
												})}

												{Object.keys(relatedEntities).length > 0 && (
													<div>
														<div className={styles.title}>
															Relationships
														</div>
														{Object.keys(relatedEntities).map((key) => {
															const targetRelationshipIndex =
																relationships.findIndex((rel) => {
																	return rel.id === key;
																});
															const targetRelationship =
																relationships[
																	targetRelationshipIndex
																];

															return (
																<div className={styles.small}>
																	<NodeOrRelationshipBlock
																		node={targetRelationship}
																		isRelationship={true}
																		classClick={() => {
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
																						entity.id
																					)
																			);
																		}}
																		showSchema={false}
																	/>
																</div>
															);
														})}
													</div>
												)}
											</div>
										);
									})}
								</div>
							);
						})}

					{mode === "entities" &&
						getActiveNodes().map((args) => {
							const [node, nodeIndex] = args;

							return (
								<div className={styles.column} key={`${node.id}${nodeIndex}`}>
									<div className={styles.contentHeader}>
										<NodeOrRelationshipBlock
											node={node}
											isRelationship={node.fields[0]?.id === "source"}
											showSchema={false}
										/>
									</div>
									{(allEntities[node.id] || [])
										.filter((item) => {
											return filterColumnItems(nodeIndex, item);
										})
										.map((item) => {
											const existingRelationships: any = {};
											Object.keys(allEntities).map((entityKey) => {
												const links = allEntities[entityKey].reduce(
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
														const propertyNamespace = node.fields.find(
															(f) => f.id === property
														)?.namespace;
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
																		{property}:
																	</div>
																	{item[property]}
																</div>
															</div>
														);
													})}
													{Object.keys(existingRelationships).length >
														0 && (
														<div>
															<div className={styles.title}>
																Relationships
															</div>
															{Object.keys(existingRelationships).map(
																(key) => {
																	const targetRelationshipIndex =
																		relationships.findIndex(
																			(rel) => {
																				return (
																					rel.id === key
																				);
																			}
																		);
																	const targetRelationship =
																		relationships[
																			targetRelationshipIndex
																		];

																	return (
																		<div
																			className={styles.small}
																		>
																			<NodeOrRelationshipBlock
																				node={
																					targetRelationship
																				}
																				isRelationship={
																					true
																				}
																				classClick={() => {
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
																				}}
																				showSchema={false}
																			/>
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
				onClick={async () => {
					await fetch("/api/schema", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							schemaNodeJson: JSON.stringify(nodes),
							relationshipJson: JSON.stringify(relationships),
							entityJson: JSON.stringify(allEntities),
						}),
					});
				}}
			/>
		</div>
	);
};

export default Editor;
