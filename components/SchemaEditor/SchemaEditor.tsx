import { Button } from "@blueprintjs/core";
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
	console.log(schema);
	const addNode = (addAtEnd: boolean) => {
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
	const addRelationship = (addAtEnd) => {
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
