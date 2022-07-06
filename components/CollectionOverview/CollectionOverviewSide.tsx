import { AnchorButton } from "@blueprintjs/core";
import React from "react";

import { Section } from "components";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";
import { convertToLocaleDateString } from "utils/shared/dates";
import { useLocationContext } from "utils/client/hooks";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	if (!collection.versions.length) {
		return <SideGettingStarted collection={collection} />;
	}

	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	const downloadButtonText =
		collection.exports.length === 0
			? "Create export"
			: collection.exports.length === 1
			? `View 1 export`
			: `View ${collection.exports.length} exports`;

	const latestVersion = collection.versions
		.map((v) => v.number)
		.sort()
		.pop();

	return (
		<div className={styles.side}>
			<Section title="Version" className={styles.small}>
				{latestVersion}
			</Section>
			<Section title="Last Published" className={styles.small}>
				{collection.updatedAt ? convertToLocaleDateString(collection.updatedAt) : "N/A"}
			</Section>
			<Section title="Download" className={styles.large}>
				<AnchorButton
					outlined
					href={`/${namespaceSlug}/${collectionSlug}/exports`}
					text={downloadButtonText}
				/>
			</Section>
		</div>
	);
};

export default CollectionOverviewSide;
