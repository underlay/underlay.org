import React from 'react';
import PropTypes from 'prop-types';
import { DiscussionPreview } from 'components';

require('./discussionList.scss');

const propTypes = {
	discussions: PropTypes.array.isRequired,
};

const DiscussionList = function(props) {
	const { discussions } = props;
	return (
		<div className="discussion-list-component">
			{discussions.map((disc) => {
				return <DiscussionPreview key={disc.id} {...disc} />;
			})}
		</div>
	);
};

DiscussionList.propTypes = propTypes;
export default DiscussionList;
