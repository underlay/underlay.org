import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	val: PropTypes.number.isRequired, // Integer number of pixels for avatar
};

const Landing = function(props) {
	const { val } = props;

	return <div>Landing! {val}</div>;
};

Landing.propTypes = propTypes;
export default Landing;
