import React, {FC} from "react";
import classNames from "classnames";

import customIcons, { IconKey } from "./customIcons";

type Props = {
	icon: IconKey;
	iconSize?: number;
	color?: string;
	className?: string;
	ariaHidden?: boolean;
	ariaLabel?: string;
};

const defaultProps = {
	iconSize: 16,
	color: "#343434",
	className: null,
	ariaHidden: false,
	ariaLabel: "",
};

const Icon: FC<Props> = (props) => {
	const viewbox = customIcons[props.icon].viewboxDefault;
	return (
		<span
			className={classNames("bp3-icon", props.className)}
			data-icon={props.icon.toLowerCase().replace(/_/gi, "-")}
			aria-label={props.ariaLabel}
			aria-hidden={props.ariaHidden}
		>
			<svg
				width={`${props.iconSize}px`}
				height={`${props.iconSize}px`}
				viewBox={`0 0 ${viewbox} ${viewbox}`}
				fill={props.color}
			>
				{customIcons[props.icon].path}
			</svg>
		</span>
	);
};

Icon.defaultProps = defaultProps;
export default Icon;
