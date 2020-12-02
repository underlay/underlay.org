import React from "react";
import classNames from "classnames";

import { ScopeHeader, ScopeNav } from "components";
import { ScopeHeaderProps } from "components/ScopeHeader/ScopeHeader";
import { ScopeNavProps } from "components/ScopeNav/ScopeNav";

import styles from "./StandardFrame.module.scss";

type Props = {
	scopeHeaderProps: ScopeHeaderProps;
	scopeNavProps: ScopeNavProps;
	content?: React.ReactNode;
	sideContent?: React.ReactNode;
	className?: string;
};

const StandardFrame: React.FC<Props> = function ({
	scopeHeaderProps,
	scopeNavProps,
	content = null,
	sideContent = null,
	className = "",
}) {
	return (
		<div className={classNames(styles.standardFrame, className)}>
			<ScopeHeader {...scopeHeaderProps} />

			<div className={styles.body}>
				<ScopeNav {...scopeNavProps} />
				<div className={styles.content}>
					<div className={styles.main}>{content}</div>
					{sideContent && <div className={styles.side}>{sideContent}</div>}
				</div>
			</div>
		</div>
	);
};

export default StandardFrame;
