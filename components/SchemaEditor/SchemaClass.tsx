import { FormEvent } from "react";
import { Button, Icon, InputGroup } from "@blueprintjs/core";
import { v4 as uuidv4 } from "uuid";

import { Schema, Class, Attribute } from "./SchemaEditor";
import SchemaAttribute from "./SchemaAttribute";
import styles from "./SchemaClass.module.scss";

type Props = {
	schemaClass: Class;
	updateClass: any;
	updateAttribute: any;
};

const SchemaClass: React.FC<Props> = function ({ schemaClass, updateClass, updateAttribute }) {
	const handleKeyUpdate = (evt: any) => {
		updateClass(schemaClass.id, { key: evt.target.value });
	};
	const addAttribute = () => {
		const defaultAttribute = {
			id: uuidv4(),
			key: "",
			type: "Text",
			isOptional: false,
			allowMultiple: false,
		};
		updateClass(schemaClass.id, { attributes: [...schemaClass.attributes, defaultAttribute] });
	};
	return (
		<div className={styles.schemaClass}>
			<div style={{ display: "flex" }}>
				<Icon icon={schemaClass.isRelationship ? "arrow-top-right" : "circle"} />
				<InputGroup
					id={`${schemaClass.id}-Class-Key`}
					className="narrow-line-input"
					value={schemaClass.key}
					onChange={handleKeyUpdate}
					placeholder={
						schemaClass.isRelationship ? "Relationship name..." : "Node name..."
					}
				/>
			</div>
			{schemaClass.attributes.map((attribute) => {
				return (
					<div key={attribute.id} className={styles.attributeWrapper}>
						<SchemaAttribute
							attribute={attribute}
							updateAttribute={(attributeId: string, updates: Attribute) => {
								updateAttribute(schemaClass.id, attributeId, updates);
							}}
						/>
					</div>
				);
			})}
			<Button onClick={addAttribute} outlined small>
				Add Attribute
			</Button>
		</div>
	);
};

export default SchemaClass;
