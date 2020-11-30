import React from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

import { Icon } from "components";
import { buildUrl } from "utils/shared/urls";

import styles from "./CollectionPreview.module.scss";

export type Collection = {
	slug: string;
	description?: string;
	numAssertions?: number;
	numFiles?: number;
	numVersions?: number;
};

type classProp = { className?: string };
type Props = classProp & Collection;

const CollectionPreview: React.FC<Props> = function ({
	slug,
	description,
	numAssertions,
	numFiles,
	numVersions,
	className = "",
}) {
	const router = useRouter();
	const { profileSlug } = router.query;

	return (
		<a
			href={buildUrl({
				profileSlug: profileSlug as string,
				contentSlug: slug,
			})}
			className={classNames(styles.preview, className)}
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
