import React, { useState } from "react";
import { Button, Dialog, Intent } from "@blueprintjs/core";

import { CollectionHeader, ThreeColumnFrame, ExportTable, ExportCreate } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionExports: React.FC<CollectionProps> = function ({ collection: initCollection }) {
	const [collection, setCollection] = useState(initCollection);
	const defaultNewExportState = {
		name: "",
		isPublic: false,
		format: "JSON",
		mapping: {},
		versionId: "",
	};
	const [newExport, setNewExport] = useState(defaultNewExportState);
	const [newExportInProgress, setNewExportInProgress] = useState(false);
	const [newExportOpen, setNewExportOpen] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const generateExport = async () => {
		setIsGenerating(true);
		const response = await fetch("/api/export/json", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: newExport.name,
				format: newExport.format,
				isPublic: newExport.isPublic,
				mapping: newExport.mapping,
				versionId: newExport.versionId,
				schemaId: collection.schemas[0].id,
				collectionId: collection.id,
			}),
		});
		const newExportObject = await response.json();
		setCollection({
			...collection,
			exports: [newExportObject, ...collection.exports],
		});
		setIsGenerating(false);
		setNewExport(defaultNewExportState);
		setNewExportInProgress(false);
		setNewExportOpen(false);
	};
	const wrappedSetNewExport = (update: any) => {
		setNewExportInProgress(true);
		return setNewExport(update);
	};
	let newButtonText = "Create New Export";
	if (newExportInProgress) {
		newButtonText = "New Export in Progress...";
	}
	if (isGenerating) {
		newButtonText = "Generating Export...";
	}
	return (
		<div>
			<CollectionHeader mode="exports" collection={collection} />
			<ThreeColumnFrame
				content={
					<div>
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<Button
								outlined
								text={newButtonText}
								onClick={() => {
									setNewExportOpen(true);
								}}
								intent={newExportInProgress ? Intent.WARNING : undefined}
							/>
						</div>
						<ExportTable collection={collection} setNewExportOpen={setNewExportOpen} />
						<Dialog
							style={{ width: "80vw" }}
							isOpen={newExportOpen}
							onClose={() => {
								setNewExportOpen(false);
							}}
						>
							<ExportCreate
								collection={collection}
								newExport={newExport}
								setNewExport={wrappedSetNewExport}
								generateExport={generateExport}
								isGenerating={isGenerating}
							/>
						</Dialog>
					</div>
				}
			/>
		</div>
	);
};

export default CollectionExports;
export const getServerSideProps = getCollectionProps;
