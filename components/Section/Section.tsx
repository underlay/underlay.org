import React from "react";
import classNames from "classnames";

import styles from "./Section.module.scss";

type Props = {
	title: string;
	className?: string;
	children: React.ReactNode;
};

const Section: React.FC<Props> = function ({ title, className = "", children }) {
	return (
		<div className={classNames(styles.section, className)}>
			<div className={styles.title}>{title}</div>
			{children}
		</div>
	);
};

export default Section;
