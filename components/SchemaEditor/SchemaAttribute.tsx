import { FormEvent } from "react";
import { Button, InputGroup } from "@blueprintjs/core";
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
	return (
		<div>
			<InputGroup
				id={`${attribute.id}-Attribute-Key`}
				className="narrow-line-input"
				value={attribute.key}
				onChange={handleKeyUpdate}
				placeholder="Attribute name..."
			/>
		</div>
	);
};

export default SchemaAttribute;
