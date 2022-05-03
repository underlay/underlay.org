import React from "react";
import styles from "./ExportTable.module.scss";
import { Button, Icon } from "@blueprintjs/core";
import { EmptyState } from "components";
import { CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { downloadData } from "utils/client/data";

type Props = {
	setNewExportOpen: any;
};

const ExportTable: React.FC<CollectionProps & Props> = function ({ collection, setNewExportOpen }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	return (
		<React.Fragment>
			<table className={styles.table}>
				<thead>
					<tr>
						<th className={styles.header}></th>
						<th className={styles.header}>Name</th>
						<th className={styles.header}>Format</th>
						<th className={styles.header}>Size</th>
						<th className={styles.header}>Mapping</th>
						<th className={styles.header}>Privacy</th>
						<th className={styles.header}>Download</th>
					</tr>
				</thead>
				<tbody>
					{collection.exports.map((exportItem) => {
						return (
							<tr key={exportItem.id}>
								<td>
									<Icon
										icon="star-empty"
										size={14}
										style={{ position: "relative", top: "-2px" }}
									/>
								</td>
								<td>{exportItem.name}</td>
								<td>{exportItem.format}</td>
								<td>{exportItem.size}</td>
								<td>Mapping</td>
								<td>{exportItem.isPublic ? "Public" : "Private"}</td>
								<td>
									<span>
										<Icon
											className={styles.downloadIcon}
											icon="download"
											size={14}
											style={{ position: "relative", top: "-2px" }}
											onClick={() => {
												if (exportItem.format === "JSON") {
													downloadData(
														`${namespaceSlug}/${collectionSlug}.csv`,
														"json",
														collection.version || "0.0.1"
													);
												} else if (exportItem.format === "CSV") {
													downloadData(
														`${namespaceSlug}/${collectionSlug}.csv`,
														"csv",
														collection.version || "0.0.1"
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
