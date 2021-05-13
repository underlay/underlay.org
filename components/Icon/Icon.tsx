import React from "react";

import { icons, IconKey } from "./icons";

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
	const viewbox = icons[icon].viewboxDefault;
	return (
		<span
			className={className}
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
				{icons[icon].path}
			</svg>
		</span>
	);
};

export default Icon;
