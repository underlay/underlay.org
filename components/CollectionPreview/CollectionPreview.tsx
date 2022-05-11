import React from "react";

import { buildUrl } from "utils/shared/urls";
import { makeSlug } from "utils/shared/strings";
import { useLocationContext } from "utils/client/hooks";

import styles from "./CollectionPreview.module.scss";
import { Collection } from "components/Icons";
import { convertToLocaleDateString } from "utils/shared/dates";

type Props = {
	slugPrefix: string;
	slugSuffix: string;
	description?: string;
	isPublic: boolean;
	version: string;
	publishedAt: Date;
};

const CollectionPreview: React.FC<Props> = function ({
	slugPrefix,
	slugSuffix,
	description,
	isPublic,
	version,
	publishedAt,
}) {
	const { namespaceSlug = "" } = useLocationContext().query;
	const slug = makeSlug(slugPrefix, slugSuffix);
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
				{slugPrefix}
			</div>
			{description && <div className={styles.description}>{description}</div>}
			<div className={styles.details}>
				<span>{!isPublic ? "Private" : "Public"}</span>
				<span className={styles.dot}>·</span>
				<span>{version}</span>
				{publishedAt && <span className={styles.dot}>·</span>}
				{publishedAt && (
					<span>Last Published at {convertToLocaleDateString(publishedAt)}</span>
				)}
			</div>
		</a>
	);
};

export default CollectionPreview;
