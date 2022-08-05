import React, { useEffect, useState } from "react";
import { Button, Icon, Intent, MenuItem } from "@blueprintjs/core";
import classNames from "classnames";
import { Select } from "@blueprintjs/select";

import { DataUpload, DataMapping } from "components";
import { CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { Schema } from "utils/shared/types";
import { getCSVHeaders } from "utils/client/data";

import styles from "./DataUploadDialog.module.scss";

type Props = {
	newUpload: any;
	setNewUpload: any;
	schema: Schema;
	uploadData: () => Promise<any>;
	isUploading: boolean;
};

const DataUploadDialog: React.FC<Props & CollectionProps> = function ({
	newUpload,
	setNewUpload,
	schema,
	uploadData,
	isUploading,
	// collection,
}) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const [csvHeaders, setCSVHeaders] = useState<string[]>([]);
	const hasSomeAlignment = newUpload?.mapping ? newUpload.mapping.length : false;
	const file = newUpload?.file;

	const setHeaders = (file: File) => {
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.addEventListener(
			"load",
			async () => {
				const csvHeaders = await getCSVHeaders(reader.result as string);
				setCSVHeaders(csvHeaders);
			},
			false
		);
		reader.readAsText(file);
	};
	useEffect(() => {
		setHeaders(file);
	}, []);

	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={`${styles.number} ${!!file ? styles.completedStep : ""}`}>1</div>
				<div className={styles.title}>Select File to Upload</div>
				{!!file && <Icon className={styles.icon} icon="tick" />}
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<DataUpload
					initFile={file}
					onFileChange={(file) => {
						setNewUpload({ file: file, mapping: [] });
						setHeaders(file);
					}}
					fullSlug={`${namespaceSlug}/${collectionSlug}`}
					// version={collection.version || ""}
				/>
			</div>
			<div className={styles.sectionHeader}>
				<div className={`${styles.number} ${hasSomeAlignment ? styles.completedStep : ""}`}>
					2
				</div>
				<div className={styles.title}>Align Data to Schema</div>
				{hasSomeAlignment && <Icon className={styles.icon} icon="tick" />}
			</div>
			<div className={classNames(styles.sectionContent)}>
				<p>Select all corresponding CSV column headers that match schema attributes.</p>
				<DataMapping
					schema={schema}
					csvHeaders={csvHeaders}
					mapping={newUpload?.mapping}
					setMapping={(newMapping) => {
						setNewUpload({ file, mapping: newMapping });
					}}
				/>
			</div>
			<div className={styles.sectionHeader}>
				<div className={styles.number}>3</div>
				<div className={styles.title}>Complete Upload</div>
			</div>
			<div className={classNames(styles.sectionContent)}>
				<div className={styles.behaviorRow}>
					Upload Behavior:
					<Select
						items={["merge", "overwrite", "concatenate"]}
						activeItem={null}
						itemRenderer={(item: string, { handleClick, modifiers }) => {
							if (!modifiers.matchesPredicate) {
								return null;
							}
							// const selectedValue = newUpload?.reductionType || "merge";
							// const isSelected = selectedValue === item;
							const descriptions = {
								merge: "Entities that share a unique identifier will be merged, with uploaded data overwriting existing fields.",
								overwrite:
									"Uploaded data will replace all existing entities, removing all previously existing data.",
								concatenate:
									"Entities in the uploaded data will be appended to the collection ignoring any duplicate unique identifiers.",
							};
							// @ts-ignore
							const activeDescription = descriptions[item];
							return (
								<MenuItem
									key={item}
									active={modifiers.active}
									onClick={handleClick}
									className={styles.behaviorSelectItem}
									text={
										<div>
											<div className={styles.behaviorSelectHeader}>
												{item}
											</div>
											<div className={styles.behaviorSelectText}>
												{activeDescription}
											</div>
										</div>
									}
								/>
							);
						}}
						onItemSelect={(value) => {
							const nextNewUpload = newUpload
								? { ...newUpload, reductionType: value }
								: { reductionType: value };
							setNewUpload(nextNewUpload);
						}}
						filterable={false}
						popoverProps={{
							minimal: true,
							modifiers: {
								preventOverflow: { enabled: false },
								flip: { enabled: false },
							},
						}}
					>
						<Button
							rightIcon="double-caret-vertical"
							className={styles.behaviorSelectButton}
							text={newUpload?.reductionType || "merge"}
						/>
					</Select>
				</div>
				<p>
					Completing the upload adds data to the collection's draft version. You will be
					able to review this data, upload more data, and publish a new version as needed.
				</p>

				<Button
					disabled={!hasSomeAlignment}
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text={"Complete Upload"}
					onClick={uploadData}
					loading={isUploading}
				/>
			</div>
		</div>
	);
};

export default DataUploadDialog;
