import { AnchorButton, ButtonGroup, Menu, MenuItem } from "@blueprintjs/core";
import React, { useState } from "react";

import { Section } from "components";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionOverviewSide.module.scss";
import SideGettingStarted from "./SideGettingStarted";
import { convertToLocaleDateString } from "utils/shared/dates";
import { useLocationContext } from "utils/client/hooks";
import { versionSorter } from "utils/shared/version";
import { Popover2 } from "@blueprintjs/popover2";

const CollectionOverviewSide: React.FC<CollectionProps> = function ({ collection }) {
	if (!collection.versions.length) {
		return <SideGettingStarted collection={collection} />;
	}

	const latestVersion = collection.versions
		.map((v) => v.number)
		.sort(versionSorter)
		.pop();

	const [includeMetadata, setIncludeMetadata] = useState(true);
	const [targetVersion, setTargetVersion] = useState(latestVersion);

	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	const downloadButtonText = `Download JSON`;

	const menuOptions = collection.versions
		.map((v) => v.number)
		.sort(versionSorter)
		.reverse()
		.map((v) => {
			return (
				<MenuItem
					textClassName={styles.minimalMenuItem}
					text={v}
					onClick={() => setTargetVersion(v)}
				/>
			);
		});

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
					href={`/api/${namespaceSlug}/${collectionSlug}/download?version=${targetVersion}&includeMetadata=${includeMetadata}`}
					text={downloadButtonText}
				/>
				<div className={styles.subsection}>
					<p>Download options</p>
					<div className={styles.option}>
						<span>Version:</span>
						<Popover2
							placement="bottom"
							content={<Menu className={styles.minimalMenu}>{menuOptions}</Menu>}
						>
							<AnchorButton
								style={{ marginLeft: ".5rem" }}
								rightIcon="caret-down"
								small
								outlined
								text={targetVersion}
								onClick={() => setIncludeMetadata(true)}
							/>
						</Popover2>
					</div>
					<div className={styles.option}>
						<span>Metadata:</span>
						<ButtonGroup style={{ marginLeft: ".5rem" }}>
							<AnchorButton
								small
								outlined
								text="Include"
								active={includeMetadata}
								onClick={() => setIncludeMetadata(true)}
							/>
							<AnchorButton
								small
								outlined
								text="Exclude"
								active={!includeMetadata}
								onClick={() => setIncludeMetadata(false)}
							/>
						</ButtonGroup>
					</div>
				</div>
			</Section>
		</div>
	);
};

export default CollectionOverviewSide;
