import { Button, ButtonGroup } from "@blueprintjs/core";
import React from "react";

import { Section } from "components";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";
import { humanFileSize } from "utils/shared/filesize";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	if (!collection.version) {
		return <SideGettingStarted collection={collection} />;
	}
	return (
		<div className={styles.side}>
			<Section title="Version" className={styles.small}>
				{collection.version}
			</Section>
			<Section title="Last Published" className={styles.small}>
				{collection.publishedAt ? collection.publishedAt.toLocaleString() : "N/A"}
			</Section>
			<Section title="Size" className={styles.small}>
				{collection.publishedDataSize
					? humanFileSize(Number(collection.publishedDataSize))
					: "N/A"}
			</Section>
			<Section title="Download" className={styles.small}>
				<ButtonGroup>
					<Button disabled outlined small text=".instance" />
					<Button disabled outlined small text=".schema" />
				</ButtonGroup>
			</Section>
		</div>
	);
};

export default CollectionOverviewSide;
