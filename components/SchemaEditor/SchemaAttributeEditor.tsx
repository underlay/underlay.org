import { Button, ButtonGroup, Checkbox, HTMLSelect, InputGroup } from "@blueprintjs/core";

import styles from "./SchemaAttributeEditor.module.scss";
import React from "react";
import type { Attribute, Class } from "utils/shared/types";

type Props = {
	isFixed: boolean;
	attribute: Attribute;
	schemaNodes: Partial<Class>[];
	updateAttribute: any;
	uidAttr?: Attribute;
};

const SchemaAttributeEditor: React.FC<Props> = function ({
	isFixed,
	attribute,
	schemaNodes,
	updateAttribute,
	uidAttr,
}) {
	const handleKeyUpdate = (evt: any) => {
		updateAttribute(attribute.id, { key: evt.target.value });
	};
	const handleTypeUpdate = (evt: any) => {
		updateAttribute(attribute.id, { type: evt.target.value });
	};
	const handleTypeSelectUpdate = (evt: any) => {
		updateAttribute(attribute.id, { type: evt.target.value });
	};
	const handleUniqueUpdate = (evt: any) => {
		updateAttribute(attribute.id, { isUID: evt.target.checked });
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
			<React.Fragment>
				<InputGroup
					id={`${attribute.id}-Attribute-Key`}
					className="narrow-line-input"
					value={attribute.key}
					onChange={handleKeyUpdate}
					placeholder="Attribute name..."
					readOnly={isFixed}
				/>
				{isFixed && (
					<HTMLSelect
						className={styles.select}
						value={attribute.type}
						onChange={handleTypeSelectUpdate}
					>
						<option value={""}>Select a Node...</option>
						{schemaNodes.map((node) => {
							return (
								<option key={node.id} value={node.id}>
									{node.key}
								</option>
							);
						})}
					</HTMLSelect>
				)}
				{!isFixed && (
					<React.Fragment>
						<HTMLSelect
							className={styles.select}
							value={attribute.type}
							onChange={handleTypeUpdate}
							options={["Text", "Number", "URL"]}
						/>

						<ButtonGroup>
							<Button
								small
								text="Optional"
								active={attribute.isOptional}
								onClick={setOptional}
							/>
							<Button
								small
								text="Required"
								active={!attribute.isOptional}
								onClick={setRequired}
							/>
						</ButtonGroup>
						<Checkbox
							disabled={uidAttr && uidAttr.id !== attribute.id}
							className={styles.checkbox}
							label={"Unique Identifier"}
							checked={attribute.isUID}
							onChange={handleUniqueUpdate}
						/>
						<Button onClick={removeAttribute} icon="trash" small minimal />
					</React.Fragment>
				)}
			</React.Fragment>
		</div>
	);
};

export default SchemaAttributeEditor;
