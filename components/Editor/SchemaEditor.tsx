import { InputGroup, HTMLSelect, ButtonGroup, Button } from "@blueprintjs/core";
import { DragHandleHorizontal } from "@blueprintjs/icons";
import { useState } from "react";
import { Node } from "./data";
import styles from "./Editor.module.scss";

interface Props {
	node: Node;
	onCommit: (node: Node) => void;
}

const SchemaEditor: React.FC<Props> = function ({ node, onCommit }) {
	const [tempNode, setTempNode] = useState<Node>(node);

	function commitTempNode() {
		onCommit(tempNode);
	}

	return (
		<div className={styles.column} key={node.id}>
			<div className={styles.contentHeader}>
				<div className={styles.namespace}>{node.namespace}</div>
				<InputGroup
					placeholder="Class..."
					value={tempNode.id}
					large
					key="classInput"
					onChange={(event) => {
						// tempNode.id = event.target.value;
						setTempNode({
							...tempNode,
							id: event.target.value,
						});
					}}
				/>
			</div>

			{tempNode.fields.map((field, fieldIndex) => {
				return (
					<div key={field.id} className={styles.schemaRow}>
						<div className={styles.namespace}>{field.namespace}</div>
						<div className={styles.schemaRowContent}>
							<DragHandleHorizontal style={{ opacity: 0.6 }} />
							<InputGroup
								placeholder="Key..."
								// asyncControl={true}
								value={field.id}
								// key={"fieldInput" + fieldIndex.toString()}
								onChange={(event) => {
									// tempNode.fields[fieldIndex].id = event.target.value;
									setTempNode({
										...tempNode,
										fields: node.fields.map((f) => {
											if (f.id === field.id) {
												return {
													...field,
													id: event.target.value,
												};
											}

											return f;
										}),
									});
								}}
							/>

							<HTMLSelect
								key="type"
								value={field.type}
								onChange={(event) => {
									tempNode.fields[fieldIndex].type = event.target.value as any;
									commitTempNode();
								}}
							>
								<option value="string">string</option>
								<option value="number">number</option>
								<option value="boolean">boolean</option>
							</HTMLSelect>

							<ButtonGroup>
								<Button
									text="Optional"
									active={!field.isRequired}
									onClick={() => {
										tempNode.fields[fieldIndex].isRequired = false;
										commitTempNode();
									}}
								/>
								<Button
									text="Required"
									active={field.isRequired}
									onClick={() => {
										tempNode.fields[fieldIndex].isRequired = true;
										commitTempNode();
									}}
								/>
							</ButtonGroup>
						</div>
					</div>
				);
			})}

			<div>
				<ButtonGroup>
					<Button
						text="Add Field"
						onClick={(ev) => {
							tempNode.fields.push({
								id: "New Node",
								namespace: "./",
								type: "string",
								isRequired: true,
								allowMultiple: false,
							});
							commitTempNode();
						}}
					/>
				</ButtonGroup>
			</div>

			<div>
				<ButtonGroup className={styles.rightButton}>
					<Button
						text="Cancel"
						onClick={(ev) => {
							setMode("entities");
						}}
					/>
					<Button
						text="Commit"
						onClick={(ev) => {
							commitTempNode();
						}}
					/>
				</ButtonGroup>
			</div>
		</div>
	);
};

export default SchemaEditor;
