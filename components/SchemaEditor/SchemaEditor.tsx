import { Button, Intent } from "@blueprintjs/core";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ThreeColumnFrame } from "components";

import SchemaClass from "./SchemaClass";
import styles from "./SchemaEditor.module.scss";

export type Attribute = {
	id: string;
	key: string;
	type: string;
	isOptional: boolean;
	allowMultiple: boolean;
};

export type Class = {
	id: string;
	key: string;
	isRelationship?: boolean;
	attributes: Attribute[];
};
export type Schema = Class[];
type Props = {
	schema: Schema | null;
	version: string | null;
};

const SchemaEditor: React.FC<Props> = function ({ schema: initSchema, version }) {
	const [schema, setSchema] = useState(initSchema || []);
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
					allowMultiple: false,
				},
				{
					id: uuidv4(),
					key: "destination",
					type: "reference",
					isOptional: false,
					allowMultiple: false,
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
	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			setIsSaving(false);
			setCanSave(false);
		}, 1500);
	};
	const buttonRow = (addAtEnd: boolean) => {
		if (version) {
			return null;
		}
		const nodeFunc = () => {
			addNode(addAtEnd);
		};
		const relationshipFunc = () => {
			addRelationship(addAtEnd);
		};
		return (
			<div>
				<Button onClick={nodeFunc}>Add Node</Button>
				<Button onClick={relationshipFunc}>Add Relationship</Button>
			</div>
		);
	};
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
					{buttonRow(false)}

					{schema.map((schemaClass) => {
						return (
							<div key={schemaClass.id} className={styles.classWrapper}>
								<SchemaClass
									schemaClass={schemaClass}
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
