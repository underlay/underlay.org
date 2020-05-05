import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon as BlueprintIcon } from '@blueprintjs/core';
import customIcons from './customIcons';

const propTypes = {
	ariaHidden: PropTypes.bool,
	ariaLabel: PropTypes.string,
	className: PropTypes.string,
	icon: PropTypes.string.isRequired,
	iconSize: PropTypes.number,
	color: PropTypes.string,
};

const defaultProps = {
	ariaHidden: false,
	ariaLabel: '',
	className: null,
	iconSize: 16,
	color: undefined,
};

const Icon = function(props) {
	if (customIcons[props.icon]) {
		const viewbox = customIcons[props.icon].viewboxDefault;
		return (
			<span
				className={classNames('bp3-icon', props.className)}
				data-icon={props.icon.toLowerCase().replace(/_/gi, '-')}
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
	}

	return (
		<BlueprintIcon
			icon={props.icon}
			color={props.color}
			iconSize={props.iconSize}
			className={props.className}
			title={props.ariaHidden ? null : props.ariaLabel}
		/>
	);
};

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;
export default Icon;
