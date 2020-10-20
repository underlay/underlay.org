import React from "react";
import classNames from "classnames";

import styles from "./DiscussionPreview.module.scss";

export type Discussion = {
	id: string;
	title: string;
	number: number;
};

type classProp = { className?: string };
type Props = classProp & Discussion;

const DiscussionPreview: React.FC<Props> = function ({ className = "", title, number }) {
	return (
		<a href="/" className={classNames(styles.preview, className)}>
			<span className={styles.number}># {number}</span>
			<span className={classNames(styles.title, "ellipsis")}>{title}</span>
		</a>
	);
};

export default DiscussionPreview;
