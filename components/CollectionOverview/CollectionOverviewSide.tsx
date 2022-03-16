import { Button, ButtonGroup } from "@blueprintjs/core";
import React from "react";

import { Section } from "components";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";

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
		</div>
	);
};

export default CollectionOverviewSide;
