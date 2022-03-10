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
	const addNode = () => {
		const defaultNode = {
			id: uuidv4(),
			key: "",
			attributes: [],
		};
		setSchema([defaultNode, ...schema]);
	};
	const addRelationship = () => {
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
		setSchema([defaultRelationship, ...schema]);
	};
	const updateClass = (classId: string, updates: { key: string }) => {
		setSchema(
			schema.map((iterClass) => {
				if (iterClass.id === classId) {
					return { ...iterClass, ...updates };
				}
				return iterClass;
			})
		);
	};
	const updateAttribute = (classId: string, attributeId: string, updates: Attribute) => {
		setSchema(
			schema.map((iterClass) => {
				if (iterClass.id === classId) {
					return {
						...iterClass,
						attributes: iterClass.attributes.map((iterAttribute) => {
							if (iterAttribute.id === attributeId) {
								return { ...iterAttribute, ...updates };
							}
							return iterAttribute;
						}),
					};
				}
				return iterClass;
			})
		);
	};
	const buttonRow = version ? null : (
		<div>
			<Button onClick={addNode}>Add Node</Button>
			<Button onClick={addRelationship}>Add Relationship</Button>
		</div>
	);
	return (
		<ThreeColumnFrame
			content={
				<React.Fragment>
					{buttonRow}

					{schema.map((schemaClass) => {
						return (
							<SchemaClass
								key={schemaClass.id}
								schemaClass={schemaClass}
								updateClass={updateClass}
								updateAttribute={updateAttribute}
							/>
						);
					})}
					{schema.length > 0 && buttonRow}
				</React.Fragment>
			}
		/>
	);
};

export default SchemaEditor;
