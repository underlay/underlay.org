import React from "react";
import styles from "./ExportTable.module.scss";
import { Export } from "@prisma/client";
import { Button, Icon } from "@blueprintjs/core";
import { EmptyState } from "components";

type Props = {
	exports: Export[];
	setNewExportOpen: any;
};

const ExportTable: React.FC<Props> = function ({ exports, setNewExportOpen }) {
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
					</tr>
				</thead>
				<tbody>
					{exports.map((exportItem) => {
						return (
							<tr key={exportItem.id}>
								<td>
									<Icon
										icon="star-empty"
										size={14}
										style={{ position: "relative", top: "-4px" }}
									/>
								</td>
								<td>{exportItem.name}</td>
								<td>{exportItem.format}</td>
								<td>{exportItem.size}</td>
								<td>Mapping</td>
								<td>{exportItem.isPublic ? "Public" : "Private"}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			{exports.length === 0 && (
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
