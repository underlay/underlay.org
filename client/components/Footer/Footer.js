import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	val: PropTypes.number.isRequired, // Integer number of pixels for avatar
};

const Footer = function(props) {
	const { val } = props;

	return <div>{val}</div>;
};

Footer.propTypes = propTypes;
export default Footer;
