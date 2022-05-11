import React, { useEffect, useState } from "react";
import { useLocationContext } from "utils/client/hooks";
import classNames from "classnames";

import styles from "./DataViewer.module.scss";
import type { Class, Mapping, Schema } from "utils/shared/types";
import { mockEntities } from "utils/client/mockData";
import { getData } from "utils/client/data";
import { CollectionProps } from "utils/server/collections";
import { EntityCard } from "components";
import { Button, NonIdealState, Spinner } from "@blueprintjs/core";
import { splitClasses } from "utils/shared/schema";
import { supabase } from "utils/client/supabase";

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

// let dataFetched = false;

type DataViewerProps = {
	// activeNodes: Class[];
	activeVersionNumber: string;
	collection: CollectionProps;
	selectedClassKey: string;
};

const DataViewer: React.FC<DataViewerProps & CollectionProps> = function ({
	activeVersionNumber,
	collection,
	selectedClassKey,
}) {
	// const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const allNodes: Class[] = collection.schemas[0].content as Schema;
	const { nodes, relationships } = splitClasses(allNodes);
	// const initNodes = allNodes.filter((n) => !n.isRelationship);
	// const initRelationships: Class[] = allNodes.filter((n) => !!n.isRelationship);
	const [gettingData, setGettingData] = useState(true);
	const [versionData, setVersionData] = useState({});

	useEffect(() => {
		setGettingData(true);
		const getAndSetData = async () => {
			const { data, error } = await supabase.storage
				.from("data")
				.download(`${collection.slugSuffix}/versions/${activeVersionNumber}.json`);
			const text = await data?.text();
			const versionData = error ? {} : JSON.parse(text);
			setVersionData(versionData);
			setGettingData(false);
		};
		const checkForSupabaseReadyInterval = setInterval(() => {
			if (supabase) {
				clearInterval(checkForSupabaseReadyInterval);
				getAndSetData();
			}
		}, 50);
	}, [activeVersionNumber]);

	const activeClass = allNodes.find((schemaClass) => {
		return schemaClass.key === selectedClassKey;
	});

	const activeEntities = versionData[selectedClassKey] || [];

	return (
		<div className={styles.dataViewer}>
			{gettingData && (
				<NonIdealState>
					<Spinner />
				</NonIdealState>
			)}
			{!gettingData && (
				<div className={styles.entities}>
					{activeClass && (
						<div className={styles.contentHeader}>
							<Button
								key={activeClass.id}
								className={styles.classRow}
								minimal
								icon={activeClass.isRelationship ? "arrow-top-right" : "circle"}
							>
								{activeClass.key}
							</Button>
						</div>
					)}
					{activeEntities.map((entity) => {
						const relationshipRendering = <div></div>;
						return (
							<EntityCard
								id={entity._ulid}
								node={activeClass}
								entity={entity}
								relationshipRendering={relationshipRendering}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default DataViewer;
