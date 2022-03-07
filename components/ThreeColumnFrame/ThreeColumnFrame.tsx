import React from "react";
import classNames from "classnames";

import styles from "./ThreeColumnFrame.module.scss";

type Props = {
	navContent?: React.ReactNode;
	content?: React.ReactNode;
	sideContent?: React.ReactNode;
	className?: string;
};

const ThreeColumnFrame: React.FC<Props> = function ({
	navContent = null,
	content = null,
	sideContent = null,
	className = "",
}) {
	return (
		<div className={classNames(styles.threeColumnFrame, className)}>
			{navContent && <div className={styles.nav}>{navContent}</div>}
			<div className={styles.main}>{content}</div>
			{sideContent && <div className={styles.side}>{sideContent}</div>}
		</div>
	);
};

export default ThreeColumnFrame;
