import React from "react";
import { NonIdealState, IconName } from "@blueprintjs/core";
import classNames from "classnames";

import styles from "./EmptyState.module.scss";

type Props = {
	className?: string;
	title: string;
	icon?: IconName;
	description?: string;
	action?: JSX.Element;
};

const EmptyState: React.FC<Props> = function ({
	className,
	title,
	icon = "widget",
	description,
	action,
}) {
	return (
		<NonIdealState
			className={classNames(styles.emptyState, className)}
			icon={icon}
			title={title}
			action={action}
			description={description}
		/>
	);
};

export default EmptyState;
