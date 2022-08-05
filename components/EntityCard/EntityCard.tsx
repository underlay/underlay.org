import type { Entity, Class } from "utils/shared/types";
import React, { useState } from "react";
import { Button } from "@blueprintjs/core";

import { CollectionProps } from "utils/server/collections";

import EntityDiscussions from "./EntityDiscussions";
import styles from "./EntityCard.module.scss";

interface Props {
	collection: CollectionProps["collection"];
	node: Class;
	entity: Entity;
	relationshipRendering: React.ReactElement;
}

const EntityCard: React.FC<Props> = function ({ collection, node, entity, relationshipRendering }) {
	const [discussionOpen, setDiscussionsOpen] = useState(false);
	const initDiscussionThreads = collection.discussionThreads.filter((thrd) => {
		return thrd.entityId === entity._ulid;
	});
	const [discussionThreads, setDiscussionThreads] = useState(initDiscussionThreads);
	return (
		<div key={entity.id} className={styles.entityCard}>
			<div className={styles.topRow}>
				<div className={styles.properties}>
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
				</div>
				<div>
					<Button
						minimal
						rightIcon="chat"
						icon={
							discussionThreads.length ? (
								<div>{discussionThreads.length}</div>
							) : undefined
						}
						onClick={() => {
							setDiscussionsOpen(true);
						}}
					/>
				</div>
			</div>

			{relationshipRendering}

			<EntityDiscussions
				isOpen={discussionOpen}
				setIsOpen={setDiscussionsOpen}
				collectionId={collection.id}
				entityId={entity._ulid}
				discussionThreads={discussionThreads}
				setDiscussionThreads={setDiscussionThreads}
			/>
		</div>
	);
};

export default EntityCard;
