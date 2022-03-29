import React from "react";
import styles from "./ExportCreate.module.scss";

import classNames from "classnames";
import { Button, ButtonGroup, HTMLSelect, InputGroup, Intent } from "@blueprintjs/core";
import { Section } from "components";

type Props = {
	newExport: any;
	setNewExport: any;
	schema: any;
	generateExport: any;
	isGenerating: boolean;
};

const ExportCreate: React.FC<Props> = function ({
	newExport,
	setNewExport,
	// schema,
	generateExport,
	isGenerating,
}) {
	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>1</div>
				<div className={styles.title}>Set Export Format and Options</div>
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<Section className={styles.option} title="Name">
					<InputGroup
						id={"export-name"}
						className="narrow-line-input"
						value={newExport.name}
						onChange={(evt: any) => {
							setNewExport({ ...newExport, name: evt.target.value });
						}}
						placeholder={"Export Name..."}
					/>
				</Section>
				<Section className={styles.option} title="Format">
					<HTMLSelect
						className={styles.select}
						value={newExport.format}
						onChange={(evt) => {
							setNewExport({ ...newExport, format: evt.target.value });
						}}
						options={["JSON", "CSV", "SQL"]}
					/>
				</Section>
				<Section className={styles.option} title="Privacy">
					<ButtonGroup>
						<Button
							text="Public"
							active={newExport.isPublic === true}
							onClick={() => {
								setNewExport({ ...newExport, isPublic: true });
							}}
						/>
						<Button
							text="Private"
							active={newExport.isPublic !== true}
							onClick={() => {
								setNewExport({ ...newExport, isPublic: false });
							}}
						/>
					</ButtonGroup>
				</Section>
			</div>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>2</div>
				<div className={styles.title}>Align Export Data</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				We'll do some alignment UI here.
			</div>

			<div className={styles.sectionHeader}>
				<div className={styles.number}>3</div>
				<div className={styles.title}>Generate Export</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				<p>
					Description about generating an export does goes here. We can explain versions,
					how they're used, etc
				</p>
				<Button
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text="Generate Export"
					onClick={generateExport}
					loading={isGenerating}
				/>
			</div>
		</div>
	);
};

export default ExportCreate;
