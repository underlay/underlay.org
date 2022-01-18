import { ButtonGroup, Button } from "@blueprintjs/core";
import { Entity, relationships } from "components/Editor/data";
import { Provenance, Discussion } from "components/Icons";

interface Props {
	entities: Entity[];
}

const EntityList: React.FC<Props> = function ({ entities }) {
	return getActiveNodes().map((args) => {
		const [node, nodeIndex] = args;

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
							const links = entities[entityKey].reduce((prev, curr) => {
								if (curr.source === item.id || curr.target === item.id) {
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
										<Button minimal icon={<Discussion size={20} />} />
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
										const currNode = findEntityById(item[property]);
										const nodeType = findNodeType(item[property]);
										return (
											<div>
												<div className={styles.propertyWrapper}>
													<div className={styles.propertyHeader}>
														<div className={styles.namespace}>
															{propertyNamespace}
														</div>
														Source:{" "}
													</div>

													<Button
														text={currNode.name || currNode.title}
														onClick={() => {
															setActiveNodes(
																activeNodes
																	.slice(0, nodeIndex + 1)
																	.concat(nodeType)
															);
															setActiveFilters(
																activeFilters
																	.slice(0, nodeIndex)
																	.concat(item[property])
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
													<div className={styles.propertyHeader}>
														<div className={styles.namespace}>
															{propertyNamespace}
														</div>
														Target:{" "}
													</div>
													<Button
														text={currNode.name || currNode.title}
														onClick={() => {
															setActiveNodes(
																activeNodes
																	.slice(0, nodeIndex + 1)
																	.concat(nodeType)
															);
															setActiveFilters(
																activeFilters
																	.slice(0, nodeIndex)
																	.concat(item[property])
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
										<div className={styles.title}>Relationships</div>
										{Object.keys(existingRelationships).map((key) => {
											const targetRelationshipIndex = relationships.findIndex(
												(rel) => {
													return rel.id === key;
												}
											);
											const targetRelationship =
												relationships[targetRelationshipIndex];

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
																setActiveRelationshipIndexes([
																	...activeRelationshipIndexes,
																	targetRelationshipIndex,
																]);
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
																	.slice(0, nodeIndex)
																	.concat(item.id)
															);
														},
														undefined,
														false
													)}
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
	});
};
export default EntityList;
