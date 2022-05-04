import { Button, ButtonGroup, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ThreeColumnFrame } from "components";

import SchemaClass from "./SchemaClass";
import styles from "./SchemaEditor.module.scss";
import type { Attribute, Schema } from "utils/shared/types";
import { CollectionProps } from "utils/server/collections";

type Props = {
	collection: CollectionProps;
	setCollection: any;
	setIsEditing: any;
	// collectionId: string;
	// schema: Schema | null;
	// version: string | null;
};

const SchemaEditor: React.FC<Props> = function ({
	collection,
	setCollection /* collectionId, schema: initSchema, version */,
	setIsEditing,
}) {
	const [schema, setSchema] = useState(collection.schemas[0] || []);
	const [canSave, setCanSave] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
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
					isUnique: false,
				},
				{
					id: uuidv4(),
					key: "target",
					type: "reference",
					isOptional: false,
					isUnique: false,
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
		const json = await response.json();
		setCollection({
			...collection,
			schemas: [json.data, ...collection.schemas],
		});
		setIsSaving(false);
		setCanSave(false);
	};
	const buttonRow = (addAtEnd: boolean) => {
		if (collection.version) {
			return null;
		}
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
						onClick={handleSave}
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
								<SchemaClass
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

export default SchemaEditor;
