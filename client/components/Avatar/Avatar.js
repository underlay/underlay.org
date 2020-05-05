import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

require('./avatar.scss');

const propTypes = {
	width: PropTypes.number.isRequired, // Integer number of pixels for avatar
	initials: PropTypes.string,
	avatar: PropTypes.string,
	instanceNumber: PropTypes.number,
	borderColor: PropTypes.string,
	borderWidth: PropTypes.string,
	doesOverlap: PropTypes.bool, // Boolean on whether a lisst of avatars will be overlapping
	isBlock: PropTypes.bool,
	className: PropTypes.string,
};

const defaultProps = {
	initials: '?',
	avatar: undefined,
	instanceNumber: undefined,
	borderColor: undefined,
	borderWidth: undefined,
	doesOverlap: false,
	isBlock: false,
	className: '',
};

const Avatar = function(props) {
	const {
		initials,
		avatar,
		instanceNumber,
		borderColor,
		borderWidth,
		width,
		doesOverlap,
		isBlock,
		className,
	} = props;

	const avatarStyle = {
		width: width,
		minWidth: width,
		height: width,
		borderColor: borderColor,
		borderWidth: borderColor ? borderWidth || Math.floor(width / 50) + 1 : 0,
		fontSize: isBlock ? Math.floor(width / 1.5) : Math.floor(width / 2.5),
		backgroundColor: 'red',
		zIndex: instanceNumber ? -1 * instanceNumber : 'initial',
		borderRadius: isBlock ? '2px' : '50%',
	};

	if (doesOverlap) {
		avatarStyle.marginRight = `${width * 0.45 * -1}px`;
	}
	if (avatar) {
		avatarStyle.backgroundImage = `url("${avatar}")`;
	}

	return (
		<div className={classNames(['avatar-component', className])} style={avatarStyle}>
			{!avatar && <div>{initials}</div>}
		</div>
	);
};

Avatar.defaultProps = defaultProps;
Avatar.propTypes = propTypes;
export default Avatar;
