import React, { useState } from "react";
import { Button, Icon, Intent, ProgressBar } from "@blueprintjs/core";
import classNames from "classnames";

import styles from "./DataUploadDialog.module.scss";
import { DataUpload, DataMapping } from "components";
import { CollectionProps } from "utils/server/collections";
import { getNextVersion } from "utils/shared/version";
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
	// newUpload,
	setNewUpload,
	schema,
	uploadData,
	isUploading,
	collection,
}) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	const [file, setFile] = useState<File>();
	const [csvHeaders, setCSVHeaders] = useState<string[]>([]);
	const [uploadProgress, setUploadProgress] = useState(0.5);

	const [currentStep, setCurrentStep] = useState(1);

	const schemaAttributesArr: { class: string; attr: string }[] = [];
	schema.forEach((c) => {
		c.attributes.forEach((a) => {
			if (c.isRelationship && (a.key === "source" || a.key === "target")) {
				return;
			}
			schemaAttributesArr.push({
				class: c.key,
				attr: a.key,
			});
		});
	});

	return (
		<div className={styles.create}>
			<div className={styles.sectionHeader}>
				<div className={`${styles.number} ${currentStep > 1 ? styles.completedStep : ""}`}>
					1
				</div>
				<div className={styles.title}>Select File to Upload</div>
				{currentStep > 1 && <Icon className={styles.icon} icon="tick" />}
			</div>
			<div className={classNames(styles.sectionContent, styles.sectionOne)}>
				<DataUpload
					onFileChange={(file) => {
						const reader = new FileReader();
						setFile(file);
						setCurrentStep(2);

						reader.addEventListener(
							"load",
							async () => {
								const csvHeaders = await getCSVHeaders(reader.result as string);
								setCSVHeaders(csvHeaders);
							},
							false
						);

						reader.readAsText(file);
					}}
					fullSlug={`${namespaceSlug}/${collectionSlug}`}
					version={collection.version || ""}
				/>
			</div>
			<div className={styles.sectionHeader}>
				<div className={`${styles.number} ${currentStep > 2 ? styles.completedStep : ""}`}>
					2
				</div>
				<div className={styles.title}>Align Data to Schema</div>
				{currentStep > 2 && <Icon className={styles.icon} icon="tick" />}
			</div>
			<div className={classNames(styles.sectionContent)}>
				<DataMapping
					schema={schema}
					csvHeaders={csvHeaders}
					onMappingChange={(mappedHeaders) => {
						const mapping = schemaAttributesArr.map((attrObj, i) => {
							return {
								...attrObj,
								csvHeader: mappedHeaders[i],
							};
						});
						setNewUpload({
							file,
							mapping,
						});
					}}
					onMappingCompleted={() => {
						setCurrentStep(3);
					}}
				/>
			</div>
			<div className={styles.sectionHeader}>
				<div className={`${styles.number} ${currentStep > 3 ? styles.completedStep : ""}`}>
					3
				</div>
				<div className={styles.title}>Publish New Version</div>
				{currentStep > 3 && <Icon className={styles.icon} icon="tick" />}
			</div>
			<div className={classNames(styles.sectionContent)}>
				<p>Publish the next version of the dataset.</p>
				{isUploading && <ProgressBar value={uploadProgress} />}
				<Button
					disabled={currentStep < 3}
					style={{ marginTop: "10px" }}
					intent={Intent.SUCCESS}
					text={"Publishing version " + getNextVersion(collection.version!)}
					onClick={() => {
						setCurrentStep(4);
						uploadData().then(() => {
							setUploadProgress(1);
						});
					}}
					loading={isUploading}
				/>
			</div>
		</div>
	);
};

export default DataUploadDialog;
