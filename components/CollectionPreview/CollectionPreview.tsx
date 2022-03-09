import React, { useState } from "react";

import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";

import styles from "./CollectionPreview.module.scss";
import { Collection } from "components/Icons";

type Props = {
	slug: string;
	description?: string;
	isPublic: boolean;
	version: string;
	lastPublished: Date;
};

const CollectionPreview: React.FC<Props> = function ({
	slug,
	description,
	isPublic,
	version,
	// lastPublished,
}) {
	const { namespaceSlug = "" } = useLocationContext().query;
	const [lastPublished] = useState(Math.round(Math.random() * 25));
	return (
		<a
			href={buildUrl({
				namespaceSlug: namespaceSlug,
				collectionSlug: slug,
			})}
			className={styles.previewBlock}
		>
			<div className={styles.title}>
				<Collection size={20} className={styles.icon} />
				{slug}
			</div>
			{description && <div className={styles.description}>{description}</div>}
			<div className={styles.details}>
				<span>{!isPublic ? "Private" : "Public"}</span>
				<span className={styles.dot}>·</span>
				<span>{version}</span>
				<span className={styles.dot}>·</span>
				{/* <span>{lastPublished}</span> */}
				<span>Last Published {lastPublished} days ago</span>
			</div>
		</a>
	);
};

export default CollectionPreview;
