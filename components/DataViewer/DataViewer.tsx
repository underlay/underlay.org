import React, { useEffect, useState } from "react";
import { useLocationContext } from "utils/client/hooks";
import classNames from "classnames";

import styles from "./DataViewer.module.scss";
import type { Class } from "utils/shared/types";
import { mockEntities } from "utils/client/mockData";
import { getData } from "utils/client/data";
import { CollectionProps } from "utils/server/collections";
import { EntityCard } from "components";
import { Button } from "@blueprintjs/core";

interface Props {
	node: Class;
	onClick?: (ev: MouseEvent) => void;
}

export const NodeOrRelationshipBlock: React.FC<Props> = function ({ node, onClick }) {
	return (
		<div
			key={node.key}
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

type DataViewerProps = {
	activeNodes: Class[];
};

const DataViewer: React.FC<DataViewerProps & CollectionProps> = function ({
	activeNodes,
	collection,
}) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const allNodes: Class[] = collection.schema as any;
	const initNodes = allNodes.filter((n) => !n.isRelationship);
	const initRelationships: Class[] = allNodes.filter((n) => !!n.isRelationship);

	// const [nodes] = useState<Class[]>(initNodes);
	// const [relationships] = useState<Class[]>(initRelationships);

	const [entities, setEntities] = useState(mockEntities);

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
				<div className={styles.entities}>
					{activeNodes.length > 0 && (
						<div className={styles.contentHeader}>
							<Button
								key={activeNodes[0].id}
								className={styles.classRow}
								minimal
								icon={activeNodes[0].isRelationship ? "arrow-top-right" : "circle"}
							>
								{activeNodes[0].key}
							</Button>
						</div>
					)}
					{getActiveEntities().map((entity) => {
						const relationshipRendering = <div></div>;
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
