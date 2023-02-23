import React, { useState } from "react";
import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import { v4 as uuidv4 } from "uuid";

import { ThreeColumnFrame } from "components";
import type { Attribute, Schema } from "utils/shared/types";
import { CollectionProps } from "utils/server/collections";

import SchemaClassEditor from "./SchemaClassEditor";
import styles from "./SchemaEditor.module.scss";
import { ErrorToaster } from "utils/client/toaster";

type Props = {
	collection: CollectionProps["collection"];
	schema: Schema;
	setCollection: any;
	setIsEditing: any;
	onSchemaChanged: (schema: Schema) => any;
};

const SchemaEditor: React.FC<Props> = function ({
	collection,
	schema: initSchema,
	setCollection,
	setIsEditing,
	onSchemaChanged,
}) {
	const [schema, setSchema] = useState<Schema>(initSchema);
	const [canSave, setCanSave] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const addNode = (addAtEnd: boolean) => {
		setCanSave(true);
		const defaultNode = {
			id: uuidv4(),
			key: "",
			attributes: [],
		};
		if (addAtEnd) {
			setSchema([...schema, defaultNode]);
		} else {
			setSchema([defaultNode, ...schema]);
		}
	};
	const addRelationship = (addAtEnd: boolean) => {
		setCanSave(true);
		const defaultRelationship = {
			id: uuidv4(),
			key: "",
			isRelationship: true,
			attributes: [
				{
					id: uuidv4(),
					key: "source",
					type: "reference",
					isOptional: false,
					isUID: false,
				},
				{
					id: uuidv4(),
					key: "target",
					type: "reference",
					isOptional: false,
					isUID: false,
				},
			],
		};
		if (addAtEnd) {
			setSchema([...schema, defaultRelationship]);
		} else {
			setSchema([defaultRelationship, ...schema]);
		}
	};
	const updateClass = (classId: string, updates: { key: string }) => {
		setCanSave(true);
		setSchema(
			schema
				.map((iterClass) => {
					if (iterClass.id === classId) {
						return { ...iterClass, ...updates };
					}
					return iterClass;
				})
				.filter((x) => !!x.id)
		);
	};
	const updateAttribute = (classId: string, attributeId: string, updates: Attribute) => {
		setCanSave(true);
		setSchema(
			schema.map((iterClass) => {
				if (iterClass.id === classId) {
					return {
						...iterClass,
						attributes: iterClass.attributes
							.map((iterAttribute) => {
								if (iterAttribute.id === attributeId) {
									return { ...iterAttribute, ...updates };
								}
								return iterAttribute;
							})
							.filter((x) => !!x.id),
					};
				}
				return iterClass;
			})
		);
	};

	const diffSchema = (oldSchema: any, newSchema: any) => {
		const addedAttrs: any[] = [];
		const updatedAttrs: any[] = [];
		const removedAttrs: any[] = [];

		const addedNodes: any[] = [];
		const updatedNodes: any[] = [];
		const removedNodes: any[] = [];

		newSchema.forEach((newNode: any) => {
			const matchingOldNode = oldSchema.find((n: any) => n.id === newNode.id);
			if (matchingOldNode) {
				newNode.attributes.forEach((newNodeAttr: any) => {
					const matchingOldNodeAttr = matchingOldNode.attributes.find(
						(a: any) => a.id === newNodeAttr.id
					);

					if (!matchingOldNodeAttr) {
						addedAttrs.push({
							nodeKey: matchingOldNode.key,
							nodeId: matchingOldNode.id,
							attrKey: newNodeAttr.key,
						});
					}

					if (matchingOldNodeAttr) {
						let isEqualAttr = true;
						for (let k in matchingOldNodeAttr) {
							if (matchingOldNodeAttr[k] !== newNodeAttr[k]) {
								isEqualAttr = false;
							}
						}

						if (!isEqualAttr) {
							updatedAttrs.push({
								nodeKey: matchingOldNode.key,
								nodeId: matchingOldNode.id,
								oldAttrKey: matchingOldNodeAttr.key,
								attrKey: newNodeAttr.key,
							});
						}
					}
				});

				matchingOldNode.attributes.forEach((oldNodeAttr: any) => {
					const matchingNewNodeAttr = newNode.attributes.find(
						(a: any) => a.id === oldNodeAttr.id
					);

					if (!matchingNewNodeAttr) {
						removedAttrs.push({
							nodeKey: matchingOldNode.key,
							nodeId: matchingOldNode.id,
							attrKey: oldNodeAttr.key,
						});
					}
				});
			}
		});

		newSchema.forEach((newNode: any) => {
			const matchingOldNode = oldSchema.find((n: any) => n.id === newNode.id);

			if (!matchingOldNode) {
				addedNodes.push(newNode);
			}

			if (matchingOldNode) {
				if (matchingOldNode.key !== newNode.key) {
					updatedNodes.push({
						key: newNode.key,
						oldNodeKey: matchingOldNode.key,
					});
				}
			}
		});

		oldSchema.forEach((oldNode: any) => {
			const matchingNewNode = newSchema.find((n: any) => n.id === oldNode.id);

			if (!matchingNewNode) {
				removedNodes.push(oldNode);
			}
		});

		return {
			addedAttrs,
			updatedAttrs,
			removedAttrs,
			addedNodes,
			updatedNodes,
			removedNodes,
		};
	};

	const handleSave = async () => {
		setIsSaving(true);

		const response = await fetch("/api/schema", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				collectionId: collection.id,
				schema: schema,
			}),
		});
		const schemaUpdateResJson = await response.json();

		await fetch("/api/collection", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				collectionId: collection.id,
				updates: { haveSchemaChange: true },
				namespaceSlug: collection.namespace.slug,
			}),
		});

		if (collection.schemas[0]) {
			const schemaDiff = diffSchema(collection.schemas[0].content, schema);

			await fetch("/api/schema/migration", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					collectionId: collection.id,
					schema,
					newSchemaId: schemaUpdateResJson.id,
					schemaDiff,
				}),
			});
		}

		setCollection({
			...collection,
			schemas:
				schemaUpdateResJson.version === "0.0"
					? [schemaUpdateResJson]
					: [schemaUpdateResJson, ...collection.schemas],
		});
		setIsSaving(false);
		setCanSave(false);
		setIsEditing(false);
		onSchemaChanged(schema);
	};
	const buttonRow = (addAtEnd: boolean) => {
		const nodeFunc = () => {
			addNode(addAtEnd);
		};
		const relationshipFunc = () => {
			addRelationship(addAtEnd);
		};
		return (
			<ButtonGroup>
				<Button onClick={nodeFunc}>Add Node</Button>
				<Button onClick={relationshipFunc}>Add Relationship</Button>
			</ButtonGroup>
		);
	};
	const schemaNodes = schema
		.filter((schemaClass) => {
			return !schemaClass.isRelationship;
		})
		.map((schemaClass) => {
			return { id: schemaClass.id, key: schemaClass.key };
		});

	return (
		<ThreeColumnFrame
			content={
				<div className={styles.editor}>
					<Button
						className={styles.sticky}
						disabled={!canSave}
						intent={Intent.SUCCESS}
						text={canSave ? "Save Schema" : "Schema Saved"}
						loading={isSaving}
						// onClick={handleSave}
						onClick={() => {
							if (isSchemaValid(schema)) {
								handleSave();
							} else {
								ErrorToaster?.show({
									message:
										"Cannot save. Please check if any Nodes or Attributes have empty or invalid names.",
									intent: "danger",
								});
							}
						}}
					/>
					<Button
						className={styles.sticky}
						text={"Cancel"}
						onClick={() => {
							setIsEditing(false);
						}}
					/>
					{buttonRow(false)}

					{schema.map((schemaClass) => {
						return (
							<div key={schemaClass.id} className={styles.classWrapper}>
								<SchemaClassEditor
									schemaClass={schemaClass}
									schemaNodes={schemaNodes}
									updateClass={updateClass}
									updateAttribute={updateAttribute}
								/>
							</div>
						);
					})}
					{schema.length > 0 && buttonRow(true)}
				</div>
			}
		/>
	);
};

function isSchemaValid(schema: Schema) {
	for (const cls of schema) {
		if (cls.key === "") {
			return false;
		}

		for (const attr of cls.attributes) {
			if (attr.key === "") {
				return false;
			}
		}
	}

	return true;
}

export default SchemaEditor;
