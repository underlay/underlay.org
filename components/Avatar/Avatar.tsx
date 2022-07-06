import React from "react";
import classNames from "classnames";
import styles from "./Avatar.module.scss";

type Props = {
	name?: string;
	src?: string | null;
	size?: number;
	className?: string;
};

const Avatar: React.FC<Props> = function ({ name = "?", src, size = 32, className = "" }) {
	const inlineStyle: any = {
		width: `${size}px`,
		height: `${size}px`,
		fontSize: Math.floor(size / 2),
	};
	if (!src) {
		inlineStyle.background = "#D6CFC7";
	}

	return (
		<div className={classNames(styles.avatar, className)} style={inlineStyle}>
			{!src && name.charAt(0)}
			{!!src && <img src={src} alt={name} />}
		</div>
	);
};

export default Avatar;
