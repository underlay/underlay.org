import { Button, ButtonGroup } from "@blueprintjs/core";
import { Section } from "components";
import React from "react";
import styles from "./CollectionOverviewSide.module.scss";

import { CollectionProps } from "utils/server/collections";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div className={styles.side}>
			<Section title="Version" className={styles.small}>
				{Math.round(Math.random() * 10)}.{Math.round(Math.random() * 10)}.
				{Math.round(Math.random() * 10)}
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
				<Button outlined text=".json" />
				<Button outlined text="PostgreSQL" />
				<Button outlined text=".csv" />
			</Section>
		</div>
	);
};

export default CollectionOverviewSide;
