import { Button } from "@blueprintjs/core";
import React from "react";
import { downloadData } from "utils/client/data";
import { useLocationContext } from "utils/client/hooks";
import { CollectionProps } from "utils/server/collections";

import styles from "./DataExport.module.scss";

const DataExport: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;

	return (
		<div className={styles.exports}>
			<Button
				outlined
				text=".json"
				onClick={(_ev: any) =>
					collection.version &&
					downloadData(
						`${namespaceSlug}/${collectionSlug}.csv`,
						"json",
						collection.version
					)
				}
			/>
			<Button
				outlined
				text=".csv"
				onClick={(_ev: any) =>
					collection.version &&
					downloadData(
						`${namespaceSlug}/${collectionSlug}.csv`,
						"csv",
						collection.version
					)
				}
			/>
			<Button disabled outlined text="PostgreSQL" />
		</div>
	);
};

export default DataExport;
