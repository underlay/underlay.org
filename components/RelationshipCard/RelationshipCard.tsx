import { ButtonGroup, Button } from "@blueprintjs/core";
import { Entity, Node } from "components/Editor/data";
import { Provenance, Discussion } from "components/Icons";
import React from "react";
import styles from "./RelationshipCard.module.scss";

interface Props {
	node: Node;
	entity: Entity;
	sourceEntity?: Entity;
	targetEntity?: Entity;
	sourceNode?: Node;
	targetNode?: Node;
	onNodeClicked: (node: Node) => void;
}

const RelationshipCard: React.FC<Props> = function ({
	node,
	entity,
	sourceEntity,
	targetEntity,
	sourceNode,
	targetNode,
	onNodeClicked,
}) {
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

				if (property === "source" || property === "target") {
					const referredEntity = property === "source" ? sourceEntity! : targetEntity!;
					const referredNode = property === "source" ? sourceNode! : targetNode!;
					const propertyText = property === "source" ? `Source:` : `Target:`;
					return (
						<div>
							<div className={styles.propertyWrapper}>
								<div className={styles.propertyHeader}>
									<div className={styles.namespace}>{propertyNamespace}</div>
									{propertyText}
								</div>

								<Button
									text={referredEntity.name || referredEntity.title}
									onClick={() => {
										onNodeClicked(referredNode);
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
								<div className={styles.namespace}>{propertyNamespace}</div>
								{property}:
							</div>
							{entity[property]}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default RelationshipCard;
