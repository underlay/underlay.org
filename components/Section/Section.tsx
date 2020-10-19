import React from "react";
import classNames from "classnames";

import styles from "./Section.module.scss";

type Props = {
	title: string;
	useMargin?: boolean;
	className?: string;
	children?: React.ReactNode;
};

const Section: React.FC<Props> = function ({
	title,
	useMargin = "false",
	className = "",
	children = null,
}) {
	return (
		<div className={classNames(styles.section, useMargin && styles.margin, className)}>
			<div className={styles.title}>{title}</div>
			{children}
		</div>
	);
};

export default Section;
