//@ts-nocheck
import React, { useEffect, useState } from "react";
import { useLocationContext } from "utils/client/hooks";
import classNames from "classnames";
import { Button, InputGroup } from "@blueprintjs/core";

import styles from "./Editor.module.scss";
import type { Entity, Node } from "./data";
import {
	nodes as mockNodes,
	relationships as mockRelationships,
	entities as mockEntities,
} from "./data";
import { getData } from "utils/client/data";
import { CollectionProps } from "utils/server/collections";
import { EntityCard, EntityRelationships, SchemaEditor2 } from "components";
import { default as NodeOrRelationshipBlock } from "./NodeOrRelationshipBlock";
import { pushToArrayIfUnseen, updateArrayWithNewElement } from "utils/shared/arrays";

let dataFetched = false;

const Editor: React.FC<CollectionProps> = function ({ collection }) {
	let initialNodes: Node[] = [];
	try {
		initialNodes = JSON.parse(collection.schema as any);
	} catch (err) {
		//TODO: Deal with malformed JSON (shouldn't happen as we are using the Editor)
		console.error(err);
	}

	// const relationships: Node[] = mockRelationships;
	const relationships: Node[] = [];

	const [nodes, setNodes] = useState<Node[]>(initialNodes || []);

	const [activeNodeIndexes, setActiveNodeIndexes] = useState<number[]>([]);
	const [activeRelationshipIndexes, setActiveRelationshipIndexes] = useState<number[]>([]);

	const [filterVal, setFilterVal] = useState("");
	const [activeNodes, setActiveNodes] = useState([]);
	const [activeFilters, setActiveFilters] = useState([]);
	const [mode, setMode] = useState("entities");
	const [entities, setEntities] = useState(mockEntities);

	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	useEffect(() => {
		if (!dataFetched) {
			setTimeout(() => {
				getData(
					namespaceSlug + "/" + collectionSlug + ".csv",
					collection.version || "0.0.1"
				).then((data) => {
					console.log(data);
					setEntities(data);
					dataFetched = true;
				});
			}, 100);
		}
	});

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
					relationship: r,
					entities: entities[r.id],
				};
			});

		return [...activeNodeEntities, ...activeRelationshipEntities];
	}

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
						<Button minimal rightIcon="add" />
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
						<SchemaEditor2
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
										Object.keys(entities).map((entityKey) => {
											const links = entities[entityKey].filter((e) => {
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
											const sourceEntity = entity.source
												? findEntityById(entity.source)
												: undefined;
											const targetEntity = entity.target
												? findEntityById(entity.target)
												: undefined;

											const sourceNode = entity.source
												? findNodeType(entity.source)
												: undefined;
											const targetNode = entity.target
												? findNodeType(entity.target)
												: undefined;

											return (
												<RelationshipCard
													entity={entity}
													node={args.relationship}
													sourceEntity={sourceEntity}
													targetEntity={targetEntity}
													sourceNode={sourceNode}
													targetNode={targetNode}
													onNodeClicked={(node) => {
														if (nodes.includes(node)) {
															setActiveNodeIndexes(
																pushToArrayIfUnseen(
																	activeNodeIndexes,
																	nodes.indexOf(node)
																)
															);
														} else if (relationships.includes(node)) {
															setActiveRelationshipIndexes(
																pushToArrayIfUnseen(
																	activeRelationshipIndexes,
																	relationships.indexOf(node)
																)
															);
														}
													}}
												/>
											);
										}
									})}
								</div>
							);
						})}
				</div>
			</div>

			<div className={styles.upload}>
				<Button
					style={{ marginTop: "20px", marginBottom: "20px" }}
					text="Upload Schema"
					className={styles.rightButton}
					onClick={async () => {
						await fetch("/api/schema", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								collection,
								schema: JSON.stringify(nodes),
							}),
						});
					}}
				/>
			</div>
		</div>
	);
};

export default Editor;
