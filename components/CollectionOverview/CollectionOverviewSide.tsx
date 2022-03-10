import { Button, ButtonGroup } from "@blueprintjs/core";
import React from "react";

import { Section, DataUpload } from "components";
import { downloadData } from "utils/client/data";
import { useLocationContext } from "utils/client/hooks";
import { CollectionProps } from "utils/server/collections";
import { getNextVersion } from "utils/shared/version";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	if (!collection.version) {
		return <SideGettingStarted collection={collection} />;
	}
	return (
		<div className={styles.side}>
			<Section title="Version" className={styles.small}>
				{collection.version}
			</Section>
			<Section title="Last Published" className={styles.small}>
				June {Math.round(Math.random() * 30)}, 201{Math.round(Math.random() * 9)}
			</Section>
			<Section title="Size" className={styles.small}>
				{Math.round(Math.random() * 12)}.{Math.round(Math.random() * 99)} MB
			</Section>
			<Section title="Download" className={styles.small}>
				<ButtonGroup>
					<Button outlined small text=".instance" />
					<Button outlined small text=".schema" />
				</ButtonGroup>
			</Section>
			<Section title="Exports" className={styles.large}>
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
			</Section>
			<Section title="Upload" className={styles.large}>
				<DataUpload
					onComplete={(_val: string) => {
						fetch("/api/collection", {
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({
								...collection,
								version: getNextVersion(collection.version || ""),
							}),
						});
					}}
					fullSlug={`${namespaceSlug}/${collectionSlug}`}
					version={collection.version || ""}
				/>
			</Section>
		</div>
	);
};

export default CollectionOverviewSide;
