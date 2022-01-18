import React, { useState } from "react";
import classNames from "classnames";
import { Button, ButtonGroup, InputGroup } from "@blueprintjs/core";
import SchemaEditor from "../SchemaEditor/SchemaEditor";
import NodeOrRelationshipBlock from "./NodeOrRelationshipBlock";

import styles from "./Editor.module.scss";
import { Discussion, Provenance } from "components/Icons";
import { Add } from "@blueprintjs/icons";
import type { Entity, Node } from "./data";
import { updateArrayWithNewElement } from "utils/shared/arrays";

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
	const entities: { [key: string]: Entity[] } = JSON.parse(data.entityJson);

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
			.filter((n) => n.id in entities)
			.map((n) => {
				return {
					node: n,
					entities: entities[n.id],
				};
			});

		const activeRelationshipEntities = activeRelationshipIndexes
			.map((i) => relationships[i])
			.filter((r) => r.id in entities)
			.map((r) => {
				return {
					node: r,
					entities: entities[r.id],
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
							return (
								<NodeOrRelationshipBlock
									node={node}
									isRelationship={false}
									classClick={() => {
										setActiveNodeIndexes([nodeIndex]);
										setActiveRelationshipIndexes([]);
										setActiveFilters([]);
										setMode("entities");
										console.log("here");
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
						getActiveEntities().map(({ node, entities }) => {
							return (
								<div className={styles.column} key={`${node.id}Entities`}>
									<div className={styles.contentHeader}>
										<div>{node.id}</div>
										<div>{entities.map((e) => e.id).join(",")}</div>
									</div>
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
														const propertyNamespace =
															findPropertyNamespace(
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
							entityJson: JSON.stringify(entities),
						}),
					});
				}}
			/>
		</div>
	);
};

export default Editor;
