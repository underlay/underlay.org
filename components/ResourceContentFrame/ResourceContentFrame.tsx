import React from "react";
import classNames from "classnames";

import styles from "./ResourceContentFrame.module.scss";

type Props = {
	content?: React.ReactNode;
	navContent?: React.ReactNode;
	sideContent?: React.ReactNode;
	className?: string;
};

const ResourceContentFrame: React.FC<Props> = function ({
	content = null,
	sideContent = null,
	navContent = null,
	className = "",
}) {
	return (
		<div className={classNames(styles.resourceContentFrame, className)}>
			{navContent && <div className={styles.nav}>{navContent}</div>}
			<div className={styles.main}>{content}</div>
			{sideContent && <div className={styles.side}>{sideContent}</div>}
		</div>
	);
};

export default ResourceContentFrame;
