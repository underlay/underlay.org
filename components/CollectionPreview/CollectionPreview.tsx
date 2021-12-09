import React from "react";

import { buildUrl } from "utils/shared/urls";
import { useLocationContext } from "utils/client/hooks";

import styles from "./CollectionPreview.module.scss";
import { Collection } from "components/Icons";

type Props = {
	slug: string;
	description?: string;
	isPrivate: boolean;
	version: string;
	lastPublished: Date;
};

const CollectionPreview: React.FC<Props> = function ({
	slug,
	description,
	isPrivate,
	// version,
	// lastPublished,
}) {
	const { profileSlug = "" } = useLocationContext().query;
	return (
		<a
			href={buildUrl({
				profileSlug: profileSlug,
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
				<span>{isPrivate ? "Private" : "Public"}</span>
				<span className={styles.dot}>·</span>
				{/* <span>{version}</span> */}
				<span>
					{Math.round(Math.random() * 10)}.{Math.round(Math.random() * 10)}.
					{Math.round(Math.random() * 10)}
				</span>
				<span className={styles.dot}>·</span>
				{/* <span>{lastPublished}</span> */}
				<span>Last Published {Math.round(Math.random() * 25)} days ago</span>
			</div>
		</a>
	);
};

export default CollectionPreview;
