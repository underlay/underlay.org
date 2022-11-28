import React, { useState } from "react";

import { supabase } from "utils/client/supabase";
import { CollectionHeader, DataUploadDialog, Section, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import {
	AnchorButton,
	Button,
	Dialog,
	Intent,
	Menu,
	MenuItem,
	NonIdealState,
} from "@blueprintjs/core";
import { Class, Mapping, Schema } from "utils/shared/types";

import styles from "./data.module.scss";
import DataViewer from "components/DataViewer/DataViewer";
import { convertToLocaleDateString } from "utils/shared/dates";
import { getSlugSuffix, generateRandomString } from "utils/shared/strings";
import { Select } from "@blueprintjs/select";
import { Version } from "@prisma/client";
import { Popover2 } from "@blueprintjs/popover2";

const CollectionData: React.FC<CollectionProps> = function ({ collection: initCollection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	const [newUpload, setNewUpload] = useState<
		undefined | { file: File; mapping: Mapping; reductionType?: string }
	>(undefined);
	const [collection, setCollection] = useState(initCollection);
	const [newUploadInProgress, setNewUploadInProgress] = useState(false);
	const [newUploadOpen, setNewUploadOpen] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

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
			// setNewUploadOpen(true);
			setIsUploading(true);
			setNewUploadInProgress(true);

			const fileName = `${generateRandomString(10)}.csv`;
			const filepath = `${getSlugSuffix(collectionSlug)}/uploads/${fileName}`;
			const { error } = await supabase.storage.from("data").upload(filepath, newUpload.file);
			const { publicURL } = await supabase.storage.from("data").getPublicUrl(filepath);
			if (error) {
				setIsUploading(false);
				console.error(error);
			}

			const response = await fetch("/api/input/csv", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					collectionId: collection.id,
					fileUri: publicURL,
					mapping: newUpload.mapping,
					reductionType: newUpload.reductionType || "merge",
				}),
			});
			const data = await response.json();
			setCollection({
				...collection,
				inputs: [data, ...collection.inputs],
			});

			setNewUploadInProgress(false);
			setIsUploading(false);
			setNewUploadOpen(false);
			setActiveVersion(undefined);
			setNewUpload(undefined);
		}
	};

	const publishVersion = async () => {
		setIsPublishing(true);

		const response = await fetch("/api/version", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				collectionId: collection.id,
			}),
		});
		const data = await response.json();

		try {
			await fetch("/api/collection", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					collectionId: collection.id,
					updates: { haveSchemaChange: false },
				}),
			});
		} catch (err) {
			console.error(err);
		}

		setCollection({
			...collection,
			versions: [data, ...collection.versions],
			haveSchemaChange: false,
		});
		setIsPublishing(false);
		setActiveVersion(data);
	};

	const schema = (collection.schemas[0]?.content as Class[]) || undefined;
	const [selectedClassKey, setSelectedClassKey] = useState(schema ? schema[0].key : "");
	const lastVersion = collection.versions[0];
	const [activeVersion, setActiveVersion] = useState<undefined | Version>(lastVersion);
	const inputsSinceVersion = collection.inputs.filter((input) => {
		if (!lastVersion) {
			return true;
		}
		if (new Date(input.createdAt) > new Date(lastVersion.createdAt)) {
			return true;
		}
		return false;
	});

	const availableVersionsToSelect = inputsSinceVersion.length
		? [{ number: "Draft", id: "draft" }, ...collection.versions]
		: collection.versions;
	return (
		<div>
			<CollectionHeader mode="data" collection={collection} />
			{!schema && <div>No schema yet</div>}
			{schema && (
				<React.Fragment>
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
														setSelectedClassKey(classElement.key);
														// setActiveNodes([classElement]);
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
														// setActiveNodes([classElement]);
														setSelectedClassKey(classElement.key);
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
									<div className={styles.buttonGroup}>
										<Select
											items={availableVersionsToSelect}
											// @ts-ignore
											itemRenderer={(
												item: Version,
												{ handleClick, modifiers }
											) => {
												if (!modifiers.matchesPredicate) {
													return null;
												}
												const isSelected =
													activeVersion?.number === item.number ||
													(!activeVersion && item.number === "Draft");
												return (
													<MenuItem
														className={
															isSelected ? "" : styles.menuItem
														}
														active={modifiers.active}
														key={item.id}
														onClick={handleClick}
														text={item.number}
														icon={isSelected ? "tick" : undefined}
													/>
												);
											}}
											onItemSelect={(item) => {
												const newValue =
													item.number === "Draft" ? undefined : item;
												setActiveVersion(newValue as Version);
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
											<Button outlined rightIcon="caret-down">
												{activeVersion && (
													<React.Fragment>
														Version {activeVersion.number} · Published{" "}
														{convertToLocaleDateString(
															activeVersion.createdAt
														)}
													</React.Fragment>
												)}
												{!activeVersion && (
													<React.Fragment>
														<div>Draft</div>
													</React.Fragment>
												)}
											</Button>
										</Select>
										{!activeVersion && !!inputsSinceVersion.length && (
											<React.Fragment>
												<Popover2
													content={
														<Menu>
															{inputsSinceVersion.map((input) => {
																console.log(input);
																return (
																	<MenuItem
																		key={input.id}
																		text={
																			<div>
																				<div
																					className={
																						styles.inputDate
																					}
																				>
																					{convertToLocaleDateString(
																						input.createdAt
																					)}
																				</div>
																				<div>
																					{
																						input
																							.sourceCsv
																							?.user
																							.name
																					}{" "}
																					uploaded a{" "}
																					<a
																						href={
																							input
																								.sourceCsv
																								?.fileUri
																						}
																					>
																						CSV file
																					</a>{" "}
																					to{" "}
																					{
																						input.reductionType
																					}
																					.
																				</div>
																			</div>
																		}
																	/>
																);
															})}
														</Menu>
													}
													minimal
													placement="bottom-start"
												>
													<Button
														outlined
														text={`${inputsSinceVersion.length} Update${
															inputsSinceVersion.length !== 1
																? "s"
																: ""
														}`}
														rightIcon="caret-down"
													/>
												</Popover2>
												<Button
													text={"Publish new version"}
													onClick={publishVersion}
													loading={isPublishing}
												/>
											</React.Fragment>
										)}
										{activeVersion && !!inputsSinceVersion.length && (
											<div>
												<Button
													text={`${inputsSinceVersion.length} Update${
														inputsSinceVersion.length !== 1 ? "s" : ""
													} on Draft`}
													outlined
													intent={Intent.WARNING}
													onClick={() => {
														setActiveVersion(undefined);
													}}
												/>
											</div>
										)}
									</div>

									<div className={styles.buttonGroup}>
										<Popover2
											interactionKind={"hover"}
											content={
												<div
													style={{
														padding: "8px 12px",
														maxWidth: "400px",
													}}
												>
													Schema has changed. Please re-upload data, map
													it to the new schema and publish a new version.
													<br />
													<br />
												</div>
											}
										>
											<AnchorButton
												hidden={!collection.haveSchemaChange}
												outlined
												text={"Schema Changed"}
												intent={Intent.WARNING}
												href={`/${namespaceSlug}/${collectionSlug}/schema`}
											/>
										</Popover2>
										<Button
											outlined
											text={newButtonText}
											onClick={() => {
												setNewUploadOpen(true);
											}}
											intent={
												newUploadInProgress ? Intent.WARNING : undefined
											}
										/>
										<AnchorButton
											outlined
											text={"Export Data"}
											href={`/${namespaceSlug}/${collectionSlug}/exports`}
										/>
									</div>
								</div>
								<div className={styles.dataFrame}>
									<DataViewer
										activeVersionNumber={activeVersion?.number || "draft"}
										collection={collection}
										selectedClassKey={selectedClassKey}
									/>

									{!collection.inputs && (
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
							</div>
						}
					/>
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
							schema={collection.schemas[0].content as Schema}
							uploadData={uploadData}
							isUploading={isUploading}
							collection={collection}
						/>
					</Dialog>
				</React.Fragment>
			)}
		</div>
	);
};

export default CollectionData;
export const getServerSideProps = getCollectionProps;
