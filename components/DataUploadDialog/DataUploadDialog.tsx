import React, { useEffect, useState } from "react";
import { Button, HTMLSelect, Icon, Intent } from "@blueprintjs/core";
import classNames from "classnames";

import styles from "./DataUploadDialog.module.scss";
import { DataUpload, DataMapping } from "components";
import { CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { Schema } from "utils/shared/types";
import { getCSVHeaders } from "utils/client/data";

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
					<HTMLSelect
						value={newUpload?.reductionType || "merge"}
						onChange={(evt) => {
							const nextNewUpload = newUpload
								? { ...newUpload, reductionType: evt.target.value }
								: { reductionType: evt.target.value };
							setNewUpload(nextNewUpload);
						}}
					>
						<option value={"merge"}>Merge</option>
						<option value={"overwrite"}>Overwrite</option>
						<option value={"concatenate"}>Concatenate</option>
					</HTMLSelect>
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
