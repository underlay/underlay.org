import React from "react";

import { usePageContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";
import Icon from "components/Icon";

import styles from "./CollectionPreview.module.scss";

type Props = {
	slug: string;
	description?: string;
	numAssertions?: number;
	numFiles?: number;
	numVersions?: number;
};

const CollectionPreview: React.FC<Props> = function ({
	slug,
	description,
	numAssertions,
	numFiles,
	numVersions,
}) {
	const { locationData } = usePageContext();
	const { profileSlug } = locationData.query;

	return (
		<a
			href={buildUrl({
				profileSlug: profileSlug,
				collectionSlug: slug,
			})}
			className={styles.preview}
		>
			<Icon className={styles.icon} icon="collection" size={20} />
			<div className={`${styles.title} ellipsis hoverline`}>{slug}</div>
			<div className={styles.description}>{description}</div>
			<div className={styles.details}>
				<span>
					{numAssertions} Message{numAssertions === 1 ? "" : "s"}
				</span>
				<span>
					{numFiles} File{numFiles === 1 ? "" : "s"}
				</span>
				<span>
					{numVersions} Version{numVersions === 1 ? "" : "s"}
				</span>
			</div>
		</a>
	);
};

export default CollectionPreview;
