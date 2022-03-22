import React, { useEffect, useState } from "react";
import { useLocationContext } from "utils/client/hooks";
import classNames from "classnames";

import styles from "./DataViewer.module.scss";
import type { Class } from "utils/shared/types";
import { mockEntities } from "utils/client/mockData";
import { getData } from "utils/client/data";
import { CollectionProps } from "utils/server/collections";
import { EntityCard } from "components";

interface Props {
	node: Class;
	onClick?: (ev: MouseEvent) => void;
}

export const NodeOrRelationshipBlock: React.FC<Props> = function ({ node, onClick }) {
	return (
		<div
			key={node.id}
			className={classNames(styles.node, node.isRelationship && styles.relationship)}
			onClick={onClick as any}
		>
			<div className={styles.key}>
				<div className={styles.name}>{node.key}</div>
			</div>
		</div>
	);
};

let dataFetched = false;

const DataViewer: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const allNodes: Class[] = collection.schema as any;
	const initNodes = allNodes.filter((n) => !n.isRelationship);
	const initRelationships: Class[] = allNodes.filter((n) => !!n.isRelationship);

	const [nodes] = useState<Class[]>(initNodes);
	const [relationships] = useState<Class[]>(initRelationships);

	const [entities, setEntities] = useState(mockEntities);

	const [activeNodes, setActiveNodes] = useState<Class[]>([]);

	useEffect(() => {
		if (!dataFetched) {
			setTimeout(() => {
				getData(
					namespaceSlug + "/" + collectionSlug + ".csv",
					collection.version || "0.0.1",
					initNodes,
					initRelationships
				).then(({ entities }) => {
					setEntities(entities);
					dataFetched = true;
				});
			}, 100);
		}
	});

	function getActiveEntities() {
		if (activeNodes.length === 0) {
			return [];
		}

		return entities[activeNodes[0].key] || [];
	}

	return (
		<div>
			<div className={styles.dataViewer}>
				<div className={styles.side}>
					<div className={styles.title}>Nodes</div>
					{nodes.map((node) => {
						return (
							<NodeOrRelationshipBlock
								node={node}
								onClick={() => {
									setActiveNodes([node]);
								}}
							/>
						);
					})}

					<div className={styles.title}>Relationships</div>
					{relationships.map((relationship) => {
						return (
							<NodeOrRelationshipBlock
								node={relationship}
								onClick={() => {
									setActiveNodes([relationship]);
								}}
							/>
						);
					})}
				</div>

				<div className={styles.entities}>
					{activeNodes.length > 0 && (
						<div className={styles.contentHeader}>
							<NodeOrRelationshipBlock node={activeNodes[0]} />
						</div>
					)}
					{getActiveEntities().map((entity) => {
						const relationshipRendering = (
							// <EntityRelationships
							//   relationships={}
							// />
							<div></div>
						);
						return (
							<EntityCard
								node={activeNodes[0]}
								entity={entity}
								relationshipRendering={relationshipRendering}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default DataViewer;
