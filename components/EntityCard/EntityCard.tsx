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
	allEntities: any;
	relationshipRendering: React.ReactElement;
}

const EntityCard: React.FC<Props> = function ({
	collection,
	node,
	entity,
	allEntities,
	relationshipRendering,
}) {
	const [discussionOpen, setDiscussionsOpen] = useState(false);
	const initDiscussionThreads = collection.discussionThreads.filter((thrd) => {
		return thrd.entityId === entity._ulid;
	});
	const [discussionThreads, setDiscussionThreads] = useState(initDiscussionThreads);

	const entityMap: { [k: string]: { entity: Entity; type: string } } = {};
	for (let eKey in allEntities) {
		allEntities[eKey].forEach((e: Entity) => {
			entityMap[e._ulid] = {
				entity: e,
				type: eKey,
			};
		});
	}

	function getEntityExpansion(id: string) {
		const target = entityMap[id];

		return (
			<div className={styles.entityExpansion}>
				<span>
					<b>{target.type}</b>
				</span>
				<span></span>
				{Object.keys(target.entity)
					.filter((attr) => {
						return attr !== "_ulid" && attr !== "_ulprov";
					})
					.map((attr) => {
						return (
							<>
								<span>{attr}</span>
								<span>{target.entity[attr]}</span>
							</>
						);
					})}
			</div>
		);
	}

	return (
		<div key={entity.id} className={styles.entityCard}>
			<div className={styles.topRow}>
				<div className={styles.properties}>
					{Object.keys(entity)
						.filter((entityAttrKey) => {
							return node.attributes.map((a) => a.key).includes(entityAttrKey);
						})
						.map((attribute) => {
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
										) : attribute === "source" ? (
											getEntityExpansion(entity.source!)
										) : attribute === "target" ? (
											getEntityExpansion(entity.target!)
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
