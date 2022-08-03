import React from "react";

import { buildUrl } from "utils/shared/urls";
import { makeSlug } from "utils/shared/strings";

import styles from "./CollectionSearchResultBlock.module.scss";
import { Collection as CollectionIcon } from "components/Icons";
import { convertToLocaleDateString } from "utils/shared/dates";
import { Collection, Namespace, Version } from "@prisma/client";
import classNames from "classnames";

type Props = {
	collection: Collection & { versions: Version[]; namespace: Namespace };
	queryString: string;
};

const CollectionSearchResultBlock: React.FC<Props> = function ({
	collection: { slugPrefix, slugSuffix, description, isPublic, versions, updatedAt, namespace },
	queryString,
}) {
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

	const namespaceHits = queryString !== "" && namespace.slug.includes(queryString);
	const collectionHits = queryString !== "" && slug.includes(queryString);

	return (
		<a
			href={buildUrl({
				namespaceSlug: namespace.slug,
				collectionSlug: slug,
			})}
			className={styles.previewBlock}
		>
			<div className={styles.title}>
				<CollectionIcon size={20} className={styles.icon} />
				<span className={classNames({ [styles.highlighted]: namespaceHits })}>
					{namespace.slug}
				</span>
				/
				<span className={classNames({ [styles.highlighted]: collectionHits })}>
					{slugPrefix}
				</span>
				{/* {`${namespace.slug}/${slugPrefix}`} */}
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

export default CollectionSearchResultBlock;
