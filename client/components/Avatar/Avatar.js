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
	className: PropTypes.string,
};

const defaultProps = {
	initials: '?',
	avatar: undefined,
	instanceNumber: undefined,
	borderColor: undefined,
	borderWidth: undefined,
	className: '',
};

const Avatar = function(props) {
	const { initials, avatar, instanceNumber, borderColor, borderWidth, width, className } = props;

	const avatarStyle = {
		width: width,
		minWidth: width,
		height: width,
		borderColor: borderColor,
		borderWidth: borderColor ? borderWidth || Math.floor(width / 50) + 1 : 0,
		fontSize: Math.floor(width / 2),
		backgroundColor: '#D3C9BD',
		zIndex: instanceNumber ? -1 * instanceNumber : 'initial',
		borderRadius: '3px',
	};

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
