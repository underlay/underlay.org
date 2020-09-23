import React from "react";
import classNames from "classnames";

import customIcons, { IconKey } from "./customIcons";

type Props = {
	icon: IconKey;
	size?: number;
	color?: string;
	className?: string;
	ariaHidden?: boolean;
	ariaLabel?: string;
};

const Icon: React.FC<Props> = ({
	icon,
	size = 16,
	color = "#343434",
	className,
	ariaHidden = false,
	ariaLabel = "",
}) => {
	const viewbox = customIcons[icon].viewboxDefault;
	return (
		<span
			className={classNames("bp3-icon", className)}
			data-icon={icon.toLowerCase().replace(/_/gi, "-")}
			aria-label={ariaLabel}
			aria-hidden={ariaHidden}
		>
			<svg
				width={`${size}px`}
				height={`${size}px`}
				viewBox={`0 0 ${viewbox} ${viewbox}`}
				fill={color}
			>
				{customIcons[icon].path}
			</svg>
		</span>
	);
};

export default Icon;
