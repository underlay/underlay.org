// @ts-nocheck
import React, { useState } from "react";
import classNames from "classnames";
import { Button, ButtonGroup, Checkbox, InputGroup } from "@blueprintjs/core";

import styles from "./Editor.module.scss";
import { nodes, relationships, entities } from "./data";
import { Discussion, Provenance, Schema } from "components/Icons";
import { ChevronDown, DragHandleHorizontal } from "@blueprintjs/icons";
type Props = {};

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

const Editor: React.FC<Props> = function ({}) {
	const [filterVal, setFilterVal] = useState("");
	const [activeNodes, setActiveNodes] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);
	const [mode, setMode] = useState("entities");

	const filterColumnItems = (index, item) => {
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
					.map((node) => {
						return classBlock(
							node,
							false,
							() => {
								setActiveNodes([node]);
								setActiveFilters([]);
								setMode("entities");
							},
							(evt) => {
								setActiveNodes([node]);
								setMode("schema");
								evt.stopPropagation();
							},
							true
						);
					})}
				<div className={styles.title}>Relationships</div>
				{relationships
					.filter((item) => {
						return (
							!filterVal ||
							item.id.toLowerCase().indexOf(filterVal.toLowerCase()) > -1
						);
					})
					.map((relationship) => {
						return classBlock(
							relationship,
							true,
							() => {
								setActiveNodes([relationship]);
								setMode("entities");
							},
							(evt) => {
								setActiveNodes([relationship]);
								setMode("schema");
								evt.stopPropagation();
							},
							true
						);
					})}
			</div>
			<div className={styles.columns}>
				{activeNodes.map((node, index) => {
					if (mode === "schema") {
						return (
							<div className={styles.column} key={node.id}>
								<div className={styles.contentHeader}>
									<div className={styles.namespace}>{node.namespace}</div>
									<InputGroup placeholder="Class..." value={node.id} large />
								</div>
								{node.fields.map((field) => {
									return (
										<div key={field.id} className={styles.schemaRow}>
											<div className={styles.namespace}>
												{field.namespace}
											</div>
											<div className={styles.schemaRowContent}>
												<DragHandleHorizontal style={{ opacity: 0.6 }} />
												<InputGroup placeholder="Key..." value={field.id} />
												<Button
													text={field.type}
													rightIcon={<ChevronDown />}
												/>
												<ButtonGroup>
													<Button
														text="Optional"
														active={!field.isRequired}
													/>
													<Button
														text="Required"
														active={field.isRequired}
													/>
												</ButtonGroup>
												<Checkbox checked={field.allowMultiple}>
													Allow Multiple
												</Checkbox>
											</div>
										</div>
									);
								})}
							</div>
						);
					}
					return (
						<div className={styles.column} key={`${node.id}${index}`}>
							<div className={styles.contentHeader}>
								{classBlock(
									node,
									node.fields[0].id === "source",
									() => {},
									() => {},
									false
								)}
							</div>
							{entities[node.id]
								.filter((item) => {
									return filterColumnItems(index, item);
								})
								.map((item) => {
									const existingRelationships: any = {};
									Object.keys(entities).map((entityKey) => {
										const links = entities[entityKey].reduce((prev, curr) => {
											if (
												curr.source === item.id ||
												curr.target === item.id
											) {
												return prev.concat(curr);
											}
											return prev;
										}, []);
										if (links.length) {
											existingRelationships[entityKey] = links;
										}
									});
									return (
										<div key={item.id} className={styles.entityCard}>
											<div className={styles.topIcons}>
												<ButtonGroup>
												<Button minimal icon={<Provenance />} />
												<Button minimal icon={<Discussion size={20} />} /></ButtonGroup>
											</div>
											{/* {item.id} */}
											{Object.keys(item).map((property) => {
												const propertyNamespace = findPropertyNamespace(
													property,
													node.id
												);
												if (property === "id") {
													return null;
												}
												if (property === "source") {
													const currNode = findEntityById(item[property]);
													const nodeType = findNodeType(item[property]);
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
																				.slice(0, index + 1)
																				.concat(nodeType)
																		);
																		setActiveFilters(
																			activeFilters
																				.slice(0, index)
																				.concat(
																					item[property]
																				)
																		);
																	}}
																/>
															</div>
														</div>
													);
												}
												if (property === "target") {
													const currNode = findEntityById(item[property]);
													const nodeType = findNodeType(item[property]);
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
																				.slice(0, index + 1)
																				.concat(nodeType)
																		);
																		setActiveFilters(
																			activeFilters
																				.slice(0, index)
																				.concat(
																					item[property]
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
															<div className={styles.propertyHeader}>
																<div className={styles.namespace}>
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
															const nodeType = relationships.find(
																(rel) => {
																	return rel.id === key;
																}
															);
															return (
																<div className={styles.small}>
																	{classBlock(
																		nodeType,
																		true,
																		() => {
																			setActiveNodes(
																				activeNodes
																					.slice(
																						0,
																						index + 1
																					)
																					.concat(
																						nodeType
																					)
																			);
																			setActiveFilters(
																				activeFilters
																					.slice(0, index)
																					.concat(item.id)
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
	);
};

export default Editor;
