import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

require('./section.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	useMargin: PropTypes.bool,
	className: PropTypes.string,
	children: PropTypes.node,
};

const defaultProps = {
	useMargin: false,
	className: '',
	children: null,
};

const Section = function(props) {
	const { title, useMargin, children, className } = props;
	return (
		<div className={classNames('section-component', useMargin && 'margin', className)}>
			<div className="section-title">{title}</div>
			{children}
		</div>
	);
};

Section.propTypes = propTypes;
Section.defaultProps = defaultProps;
export default Section;
