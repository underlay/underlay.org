import type { Entity, Class } from "utils/shared/types";
import React from "react";
import styles from "./EntityCard.module.scss";

interface Props {
	node: Class;
	entity: Entity;
	relationshipRendering: React.ReactElement;
}

const EntityCard: React.FC<Props> = function ({ node, entity, relationshipRendering }) {
	return (
		<div key={entity.id} className={styles.entityCard}>
			{Object.keys(entity).map((attribute) => {
				if (attribute === "_ulid" || attribute === "_ulprov") {
					return null;
				}

				const matchAttr = node.attributes.find((a) => a.key === attribute);
				return (
					<div key={entity._ulid + attribute}>
						<div className={styles.propertyWrapper}>
							<div className={styles.propertyHeader}>{attribute}:</div>
							{matchAttr && matchAttr.type === "URL" ? (
								<a target="_blank" href={entity[attribute]}>
									{entity[attribute]}
								</a>
							) : (
								<span>{entity[attribute]}</span>
							)}
						</div>
					</div>
				);
			})}

			{relationshipRendering}
		</div>
	);
};

export default EntityCard;
