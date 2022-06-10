// import { Button, ButtonGroup } from "@blueprintjs/core";
import React from "react";

// import { Section } from "components";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";
// import { humanFileSize } from "utils/shared/filesize";
// import { convertToLocaleDateString } from "utils/shared/dates";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	if (!collection.versions.length) {
		return <SideGettingStarted collection={collection} />;
	}
	return (
		<div className={styles.side}>
			{/* TODO: make this section real */}
			{/* <Section title="Version" className={styles.small}>
				{collection.version}
			</Section>
			<Section title="Last Published" className={styles.small}>
				{collection.publishedAt ? convertToLocaleDateString(collection.publishedAt) : "N/A"}
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
			 */}
		</div>
	);
};

export default CollectionOverviewSide;
