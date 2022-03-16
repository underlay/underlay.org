import { ButtonGroup, Button } from "@blueprintjs/core";
import type { Entity, Node } from "utils/shared/types";
import { Provenance, Discussion } from "components/Icons";
import React from "react";
import styles from "./EntityCard.module.scss";

interface Props {
	node: Node;
	entity: Entity;
	relationshipRendering: React.ReactElement;
}

const EntityCard: React.FC<Props> = function ({ node, entity, relationshipRendering }) {
	return (
		<div key={entity.id} className={styles.entityCard}>
			<div className={styles.topIcons}>
				<ButtonGroup>
					<Button minimal icon={<Provenance />} />
					<Button minimal icon={<Discussion size={20} />} />
				</ButtonGroup>
			</div>

			{Object.keys(entity).map((property) => {
				if (property === "id") {
					return null;
				}
				const propertyNamespace = node.fields.find((f) => f.id === property)?.namespace;
				return (
					<div>
						<div className={styles.propertyWrapper}>
							<div className={styles.propertyHeader}>
								<div className={styles.namespace}>{propertyNamespace}</div>
								{property}:
							</div>
							{entity[property]}
						</div>
					</div>
				);
			})}

			{relationshipRendering}
		</div>
	);
};

export default EntityCard;
