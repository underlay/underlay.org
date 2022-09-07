import React, { useState } from "react";
import styles from "./ExportTable.module.scss";
import { Button, Icon, Menu, MenuItem } from "@blueprintjs/core";
import { EmptyState } from "components";
import { CollectionProps } from "utils/server/collections";
import { Select } from "@blueprintjs/select";
import { Version } from "@prisma/client";
import { downloadExport } from "utils/client/data";
import { humanFileSize } from "utils/shared/filesize";

type Props = {
	setNewExportOpen: any;
	setShowMappingIndex: any;
};

const ExportTable: React.FC<CollectionProps & Props> = function ({
	collection,
	setNewExportOpen,
	setShowMappingIndex,
}) {
	const [selectedVersions, setSelectedVersions] = useState(
		collection.exports.map((e) => {
			return e.exportVersions.length > 0
				? e.exportVersions[e.exportVersions.length - 1].version.number
				: "0.0.1";
		})
	);

	return (
		<React.Fragment>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.header}>Name</th>
						<th className={styles.header}>Format</th>
						<th className={styles.header}>Size</th>
						<th className={styles.header}>Mapping</th>
						<th className={styles.header}>Privacy</th>
						<th className={styles.header}>Download</th>
					</tr>
				</thead>
				<tbody>
					{collection.exports.map((exportItem, exportItemI) => {
						const selectedVersion = selectedVersions[exportItemI];
						let exportSize = "N/A";
						if (exportItem.exportVersions.length > 0) {
							const lastVersion = exportItem.exportVersions
								.map((v) => v.version.number)
								.pop();
							const targetExport = exportItem.exportVersions.find((v) => {
								return v.version.number === lastVersion;
							})!;
							exportSize = targetExport.size;
						}

						return (
							<tr key={exportItem.id}>
								<td>{exportItem.name}</td>
								<td>{exportItem.format}</td>
								<td>{humanFileSize(exportSize)}</td>
								<td>
									<Button onClick={() => setShowMappingIndex(exportItemI)}>
										Mapping
									</Button>
								</td>
								<td>{exportItem.isPublic ? "Public" : "Private"}</td>
								<td>
									<Select
										className={styles.versionSelect}
										items={exportItem.exportVersions.map((ev) => ev.version)}
										itemRenderer={(
											item: Version,
											{ handleClick, modifiers }
										) => {
											const isSelected = item.number === selectedVersion;

											return (
												<MenuItem
													className={isSelected ? "" : styles.menuItem}
													active={modifiers.active}
													key={item.id}
													onClick={handleClick}
													text={item.number}
													icon={isSelected ? "tick" : undefined}
												/>
											);
										}}
										onItemSelect={(item: Version) => {
											setSelectedVersions(
												selectedVersions.map((v, i) => {
													if (i === exportItemI) {
														return item.number;
													}

													return v;
												})
											);
										}}
										itemListRenderer={({
											items,
											itemsParentRef,
											renderItem,
										}) => {
											const renderedItems = items.reverse().map(renderItem);

											return (
												<Menu
													ulRef={itemsParentRef}
													className={styles.selectMenu}
												>
													{renderedItems}
												</Menu>
											);
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
										<Button text={selectedVersions[exportItemI]} />
									</Select>
									<span>
										<Icon
											className={styles.downloadIcon}
											icon="download"
											size={14}
											style={{ position: "relative", top: "-2px" }}
											onClick={() => {
												const targetVersion =
													exportItem.exportVersions.find((v) => {
														return v.version.number === selectedVersion;
													});
												if (targetVersion) {
													downloadExport(
														targetVersion.fileUri,
														`${collection.namespace.slug}/${
															collection.slugPrefix
														}-${collection.slugSuffix}-${
															targetVersion.version.number
														}.${exportItem.format.toLowerCase()}`
													);
												}
											}}
										/>
									</span>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			{collection.exports.length === 0 && (
				<EmptyState
					title="No Exports Yet"
					action={
						<Button onClick={() => setNewExportOpen(true)}>Create New Export</Button>
					}
				/>
			)}
		</React.Fragment>
	);
};

export default ExportTable;
