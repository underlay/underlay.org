import React from 'react';
import PropTypes from 'prop-types';

require('./discussionPreview.scss');

const propTypes = {
	title: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
};

const DiscussionPreview = function(props) {
	const { title, number } = props;

	return (
		<a href="/" className="discussion-preview-component">
			<span className="number"># {number}</span>
			<span className="title ellipsis">{title}</span>
		</a>
	);
};

DiscussionPreview.propTypes = propTypes;
export default DiscussionPreview;
