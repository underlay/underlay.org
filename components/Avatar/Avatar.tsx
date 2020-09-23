import React from "react";
import classNames from "classnames";

import styles from "./Avatar.module.scss";

type Props = {
	src?: string;
	initial?: string;
	width?: number; // Integer number of pixels for avatar
	borderColor?: string;
	borderWidth?: string;
	className?: string;
};

const Avatar: React.FC<Props> = function ({
	src,
	initial = "?",
	width = 32,
	borderColor,
	borderWidth,
	className,
}) {
	const avatarStyle = {
		width: width,
		minWidth: width,
		height: width,
		borderColor: borderColor,
		borderWidth: borderColor ? borderWidth || Math.floor(width / 50) + 1 : 0,
		fontSize: Math.floor(width / 2),
		backgroundColor: "#D3C9BD",
		borderRadius: "3px",
		backgroundImage: src ? `url("${src}")` : undefined,
	};

	return (
		<div className={classNames([className, styles.avatar])} style={avatarStyle}>
			{!src && <div>{initial}</div>}
		</div>
	);
};

export default Avatar;
