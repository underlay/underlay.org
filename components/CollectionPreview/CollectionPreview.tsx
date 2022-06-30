import React from "react";

import { buildUrl } from "utils/shared/urls";
import { makeSlug } from "utils/shared/strings";
import { useLocationContext } from "utils/client/hooks";
import { CollectionProps } from "utils/server/collections";

import styles from "./CollectionPreview.module.scss";
import { Collection } from "components/Icons";
import { convertToLocaleDateString } from "utils/shared/dates";

type Props = CollectionProps & {};

const CollectionPreview: React.FC<Props> = function ({
	collection: { slugPrefix, slugSuffix, description, isPublic, versions, updatedAt },
}) {
	const { namespaceSlug = "" } = useLocationContext().query;
	const slug = makeSlug(slugPrefix, slugSuffix);

	let versionText = "";
	let timestampText = "";

	/**
	 * No published versions yet
	 */
	if (versions.length === 0) {
		versionText = "No version published";
		timestampText = `Last updated at ${convertToLocaleDateString(updatedAt)}`;
	} else {
		const currVersion = versions.map((v) => v.number).sort()[0];

		versionText = `${currVersion}`;
		timestampText = `Last published at ${convertToLocaleDateString(updatedAt)}`;
	}

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
				<span>{versionText}</span>
				{<span className={styles.dot}>·</span>}
				{<span>{timestampText}</span>}
			</div>
		</a>
	);
};

export default CollectionPreview;
