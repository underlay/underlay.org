import React, { useState } from "react";

import { CollectionHeader, DataUploadDialog, Section, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { AnchorButton, Button, Dialog, Intent, NonIdealState } from "@blueprintjs/core";
import { Class, Mapping, Schema } from "utils/shared/types";
import { uploadData as uploadDataToSupabase } from "utils/client/data";

import styles from "./data.module.scss";
import DataViewer from "components/DataViewer/DataViewer";
import { getNextVersion } from "utils/shared/version";

const CollectionData: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	const [newUpload, setNewUpload] = useState<undefined | { file: File; mapping: Mapping }>(
		undefined
	);
	const [newUploadInProgress, setNewUploadInProgress] = useState(false);
	const [newUploadOpen, setNewUploadOpen] = useState(false);
	const [isUploading, _setIsUploading] = useState(false);

	let newButtonText = "Upload Data";
	if (newUploadInProgress) {
		newButtonText = "New Upload in Progress...";
	}
	if (isUploading) {
		newButtonText = "Uploading Data...";
	}

	const wrappedSetNewUpload = (update: any) => {
		setNewUploadInProgress(true);
		return setNewUpload(update);
	};

	/**
	 * - Upload file
	 * - Update mapping
	 * - Set new version
	 */
	const uploadData = async () => {
		if (newUpload) {
			setNewUploadOpen(true);
			_setIsUploading(true);
			setNewUploadInProgress(true);

			const nextVer = getNextVersion(collection.version || "");

			await fetch("/api/collection", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...collection,
					version: nextVer,
					publishedAt: new Date(),
					publishedDataSize: newUpload.file.size,
					schemaMapping: newUpload.mapping,
				}),
			});

			await uploadDataToSupabase(
				newUpload.file,
				`${namespaceSlug}/${collectionSlug}` + ".csv",
				nextVer
			);

			setNewUploadInProgress(false);
			_setIsUploading(false);
			setNewUploadOpen(false);
		}
	};

	const schema = collection.schema as Class[];

	const [activeNodes, setActiveNodes] = useState<Class[]>([schema[0]]);

	return (
		<div>
			<CollectionHeader mode="data" collection={collection} />
			<ThreeColumnFrame
				className={styles.frame}
				navContent={
					<div className={styles.schema}>
						<Section title="Nodes">
							{schema
								.filter((classElement) => {
									return !classElement.isRelationship;
								})
								.map((classElement) => {
									return (
										<Button
											key={classElement.id}
											className={styles.classRow}
											onClick={() => {
												setActiveNodes([classElement]);
											}}
											minimal
											fill
											icon={"circle"}
										>
											{classElement.key}
										</Button>
									);
								})}
						</Section>
						<Section title="Relationships">
							{schema
								.filter((classElement) => {
									return classElement.isRelationship;
								})
								.map((classElement) => {
									return (
										<Button
											key={classElement.id}
											className={styles.classRow}
											onClick={() => {
												setActiveNodes([classElement]);
											}}
											minimal
											fill
											icon={"arrow-top-right"}
										>
											{classElement.key}
										</Button>
									);
								})}
						</Section>
					</div>
				}
				content={
					<div>
						<div className={styles.dataHeader}>
							{collection.version && (
								<div>Version {collection.version} · Published Mar 5, 2020</div>
							)}
							{!collection.version && <div />}
							<div>
								<Button
									style={{ marginRight: "10px" }}
									outlined
									text={newButtonText}
									onClick={() => {
										setNewUploadOpen(true);
									}}
									intent={newUploadInProgress ? Intent.WARNING : undefined}
								/>
								<AnchorButton
									outlined
									text={"Export Data"}
									href={`/${namespaceSlug}/${collectionSlug}/exports`}
								/>
							</div>
						</div>
						<div className={styles.dataFrame}>
							<DataViewer collection={collection} activeNodes={activeNodes} />

							{!collection.version && (
								<NonIdealState
									className={styles.emptyState}
									title="No Data Yet"
									icon="widget"
									action={
										<Button
											onClick={() => {
												setNewUploadOpen(true);
											}}
										>
											Upload Data from File
										</Button>
									}
								/>
							)}
						</div>
						<Dialog
							style={{ width: "80vw" }}
							isOpen={newUploadOpen}
							onClose={() => {
								setNewUploadOpen(false);
							}}
						>
							<DataUploadDialog
								newUpload={newUpload}
								setNewUpload={wrappedSetNewUpload}
								schema={collection.schema as Schema}
								uploadData={uploadData}
								isUploading={isUploading}
								collection={collection}
							/>
						</Dialog>
					</div>
				}
			/>
		</div>
	);
};

export default CollectionData;
export const getServerSideProps = getCollectionProps;
