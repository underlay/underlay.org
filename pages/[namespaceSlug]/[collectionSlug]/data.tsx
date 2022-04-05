import React, { useState } from "react";

import { CollectionHeader, DataUploadDialog, Section, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
// import DataViewer from "components/DataViewer/DataViewer";
import { AnchorButton, Button, Dialog, Intent, NonIdealState } from "@blueprintjs/core";
import { Class } from "utils/shared/types";

import styles from "./data.module.scss";
import DataViewer from "components/DataViewer/DataViewer";

const CollectionData: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	const [newUpload, setNewUpload] = useState({});
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
	const uploadData = () => {};
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
								schema={collection.schema}
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
