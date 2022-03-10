import { FormEvent } from "react";
import { Button, ButtonGroup, Checkbox, HTMLSelect, InputGroup } from "@blueprintjs/core";
import { v4 as uuidv4 } from "uuid";

import { Schema, Attribute } from "./SchemaEditor";
import styles from "./SchemaAttribute.module.scss";

type Props = {
	attribute: Attribute;
	updateAttribute: any;
};

const SchemaAttribute: React.FC<Props> = function ({ attribute, updateAttribute }) {
	const handleKeyUpdate = (evt: any) => {
		updateAttribute(attribute.id, { key: evt.target.value });
	};
	const handleTypeUpdate = (evt: any) => {
		updateAttribute(attribute.id, { type: evt.target.value });
	};
	const setOptional = () => {
		updateAttribute(attribute.id, { isOptional: true });
	};
	const setRequired = () => {
		updateAttribute(attribute.id, { isOptional: false });
	};
	const removeAttribute = () => {
		updateAttribute(attribute.id, { id: null });
	};
	return (
		<div className={styles.attribute}>
			<InputGroup
				id={`${attribute.id}-Attribute-Key`}
				className="narrow-line-input"
				value={attribute.key}
				onChange={handleKeyUpdate}
				placeholder="Attribute name..."
			/>
			<HTMLSelect
				className={styles.select}
				value={attribute.type}
				onChange={handleTypeUpdate}
				options={["Text", "Number", "URL"]}
			/>

			<ButtonGroup>
				<Button small text="Optional" active={attribute.isOptional} onClick={setOptional} />
				<Button
					small
					text="Required"
					active={!attribute.isOptional}
					onClick={setRequired}
				/>
			</ButtonGroup>
			<Button onClick={removeAttribute} icon="trash" small minimal />
		</div>
	);
};

export default SchemaAttribute;
