import React from "react";
import classNames from "classnames";

import styles from "./Section.module.scss";

type Props = {
	title: string;
	action?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
};

const Section: React.FC<Props> = function ({ title, className = "", children, action }) {
	return (
		<div className={classNames(styles.section, className)}>
			<div className={styles.title}>
				{title}
				<div className={styles.action}>{action}</div>
			</div>
			{children}
		</div>
	);
};

export default Section;
