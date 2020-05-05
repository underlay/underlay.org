import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Avatar } from 'components';

require('./scopeHeader.scss');

const propTypes = {
	type: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	detailsTop: PropTypes.node,
	detailsBottom: PropTypes.node,
	avatar: PropTypes.string,
};

const defaultProps = {
	detailsTop: null,
	detailsBottom: null,
	avatar: undefined,
};
const ScopeHeader = function(props) {
	const { type, title, detailsTop, detailsBottom, avatar } = props;
	return (
		<div className="scope-header-component clearfix">
			<Icon className="type-icon" icon={type} iconSize={28} />
			{avatar && <Avatar avatar={avatar} width={100} />}
			<div className="title">{title}</div>
			<div className="details top">{detailsTop}</div>
			<div className="details">{detailsBottom}</div>
		</div>
	);
};

ScopeHeader.propTypes = propTypes;
ScopeHeader.defaultProps = defaultProps;
export default ScopeHeader;
