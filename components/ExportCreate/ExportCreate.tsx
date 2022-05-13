import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Button, ButtonGroup, Checkbox, HTMLSelect, InputGroup, Intent } from "@blueprintjs/core";

import { Section } from "components";
import { Schema } from "utils/shared/types";

import styles from "./ExportCreate.module.scss";

type Props = {
	newExport: any;
	setNewExport: any;
	collection: any;
	generateExport: any;
	isGenerating: boolean;
};

const ExportCreate: React.FC<Props> = function ({
	newExport,
	setNewExport,
	collection,
	generateExport,
	isGenerating,
}) {
	const lastVersion = collection.versions[0];
	const [activeVersion, setActiveVersion] = useState(lastVersion);
	const schema = collection.schemas[0].content as Schema;
	useEffect(() => {
		const mapping = {};
		schema.forEach((schemaClass) => {
			const classMap = {
				include: true,
				rename: "",
				attributes: {},
			};
			schemaClass.attributes.forEach((attr) => {
				classMap.attributes[attr.key] = {
					include: true,
					rename: "",
				};
			});
			mapping[schemaClass.key] = classMap;
		});
		setNewExport({
			...newExport,
			versionId: activeVersion.id,
			mapping: mapping,
		});
	}, []);
	console.log(newExport.mapping);
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
				<Section className={styles.option} title="Base Version">
					Put select here
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
				{schema.map((schemaClass) => {
					return (
						<div key={schemaClass.id}>
							<div>
								{schemaClass.key} ·
								<Checkbox
									checked={newExport.mapping[schemaClass.key]?.include}
									label="Include"
									onChange={(evt) => {
										const nextMapping = { ...newExport.mapping };
										nextMapping[schemaClass.key].include = evt.target.checked;
										setNewExport({
											...newExport,
											mapping: nextMapping,
										});
									}}
								/>
								<InputGroup
									type="text"
									value={newExport.mapping[schemaClass.key]?.rename}
									onChange={(evt) => {
										const nextMapping = { ...newExport.mapping };
										nextMapping[schemaClass.key].rename = evt.target.value;
										setNewExport({
											...newExport,
											mapping: nextMapping,
										});
									}}
								/>
							</div>
							{schemaClass?.attributes.map((attr) => {
								return (
									<div key={attr.id}>
										{attr.key} ·{" "}
										<Checkbox
											checked={
												newExport.mapping[schemaClass.key]?.attributes[
													attr.key
												].include
											}
											label="Include"
											onChange={(evt) => {
												const nextMapping = { ...newExport.mapping };
												nextMapping[schemaClass.key].attributes[
													attr.key
												].include = evt.target.checked;
												setNewExport({
													...newExport,
													mapping: nextMapping,
												});
											}}
										/>
										<InputGroup
											type="text"
											value={
												newExport.mapping[schemaClass.key]?.attributes[
													attr.key
												].rename
											}
											onChange={(evt) => {
												const nextMapping = { ...newExport.mapping };
												nextMapping[schemaClass.key].attributes[
													attr.key
												].rename = evt.target.value;
												setNewExport({
													...newExport,
													mapping: nextMapping,
												});
											}}
										/>
									</div>
								);
							})}
						</div>
					);
				})}
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
