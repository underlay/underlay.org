import React from "react";
import classNames from "classnames";

import styles from "./Section.module.scss";

type Props = {
	title: string;
	useMargin?: boolean; // Whether content under the title should have a margin
	isSide?: boolean; // Whether this Section is used in a side panel
	className?: string;
	children?: React.ReactNode;
};

const Section: React.FC<Props> = function ({
	title,
	useMargin = false,
	isSide = false,
	className = "",
	children = null,
}) {
	return (
		<div
			className={classNames(
				styles.section,
				useMargin && styles.margin,
				isSide && styles.side,
				className
			)}
		>
			<div className={styles.title}>{title}</div>
			{children}
		</div>
	);
};

export default Section;
