import { Icon, InputGroup, HTMLSelect, ButtonGroup, Button } from "@blueprintjs/core";
import { updateArrayWithNewElement } from "utils/shared/arrays";
import { useState } from "react";
import { FieldType, Node } from "../Editor/data";
import styles from "./SchemaEditor2.module.scss";

interface Props {
	node: Node;
	onCancel: () => void;
	onCommit: (node: Node) => void;
}

const SchemaEditor2: React.FC<Props> = function ({ node, onCancel, onCommit }) {
	const [nodeId, setNodeId] = useState<string>(node.id);
	const [fieldIds, setFieldIds] = useState<string[]>(node.fields.map((f) => f.id));
	const [fieldTypes, setFieldTypes] = useState<FieldType[]>(node.fields.map((f) => f.type));
	const [fieldIsRequireds, setFieldIsRequireds] = useState<boolean[]>(
		node.fields.map((f) => f.isRequired)
	);

	const nodeForm: JSX.Element = (
		<InputGroup
			placeholder="Class..."
			value={nodeId}
			large
			key="classInput"
			onChange={(ev) => {
				setNodeId(ev.target.value);
			}}
		/>
	);

	const fieldForms: JSX.Element[] = [];
	node.fields.forEach((f, fieldIndex) => {
		fieldForms.push(
			<div key={"field" + fieldIndex.toString()} className={styles.schemaRow}>
				<div className={styles.namespace}>{f.namespace}</div>
				<div className={styles.schemaRowContent}>
					<Icon icon="drag-handle-horizontal" style={{ opacity: 0.6 }} />
					<InputGroup
						value={fieldIds[fieldIndex]}
						placeholder="Key..."
						key={"fieldInput" + fieldIndex.toString()}
						onChange={(ev) => {
							setFieldIds(
								updateArrayWithNewElement(fieldIds, fieldIndex, ev.target.value)
							);
						}}
					/>

					<HTMLSelect
						key={"type" + fieldIndex.toString()}
						value={fieldTypes[fieldIndex]}
						onChange={(ev) => {
							setFieldTypes(
								updateArrayWithNewElement(
									fieldTypes,
									fieldIndex,
									ev.target.value as FieldType
								)
							);
						}}
					>
						<option value="string">string</option>
						<option value="number">number</option>
						<option value="boolean">boolean</option>
					</HTMLSelect>

					<ButtonGroup>
						<Button
							text="Optional"
							active={!fieldIsRequireds[fieldIndex]}
							onClick={() => {
								setFieldIsRequireds(
									updateArrayWithNewElement(fieldIsRequireds, fieldIndex, false)
								);
							}}
						/>
						<Button
							text="Required"
							active={fieldIsRequireds[fieldIndex]}
							onClick={() => {
								setFieldIsRequireds(
									updateArrayWithNewElement(fieldIsRequireds, fieldIndex, true)
								);
							}}
						/>
					</ButtonGroup>
				</div>
			</div>
		);
	});

	return (
		<div className={styles.column} key={node.id}>
			<div className={styles.contentHeader}>
				<div className={styles.namespace}>{node.namespace}</div>
				{nodeForm}
			</div>

			{fieldForms}

			<div>
				<ButtonGroup>
					<Button
						text="Add Field"
						onClick={() => {
							node.fields.push({
								id: "New Field",
								namespace: "./",
								type: "string",
								isRequired: true,
								allowMultiple: false,
							});
							setFieldIds([...fieldIds, "New Field"]);
							setFieldTypes([...fieldTypes, "string"]);
							setFieldIsRequireds([...fieldIsRequireds, true]);
						}}
					/>
				</ButtonGroup>
			</div>

			<div>
				<ButtonGroup className={styles.rightButton}>
					<Button
						text="Cancel"
						onClick={() => {
							onCancel();
						}}
					/>
					<Button
						text="Commit"
						onClick={() => {
							onCommit({
								id: nodeId,
								namespace: node.namespace,
								fields: node.fields.map((field, i) => {
									return {
										...field,
										id: fieldIds[i],
										type: fieldTypes[i],
										isRequired: fieldIsRequireds[i],
									};
								}),
							});
						}}
					/>
				</ButtonGroup>
			</div>
		</div>
	);
};

export default SchemaEditor2;
