import React from 'react';
import PropTypes from 'prop-types';
import { Section, Avatar, DiscussionList } from 'components';

const propTypes = {
	discussions: PropTypes.array.isRequired,
	members: PropTypes.array,
};

const defaultProps = {
	members: [],
};

const NamespaceOverviewSide = function(props) {
	const { discussions, members } = props;

	return (
		<React.Fragment>
			<Section title="Recent Discussions">
				<DiscussionList discussions={discussions} />
			</Section>
			{!!members.length && (
				<Section title="People">
					{members.map((member) => {
						return (
							<a href={`/${member.user.slug}`} key={member.user.slug}>
								<Avatar
									avatar={member.user.avatar}
									initials={member.user.initials}
									width={35}
								/>
							</a>
						);
					})}
				</Section>
			)}
		</React.Fragment>
	);
};

NamespaceOverviewSide.propTypes = propTypes;
NamespaceOverviewSide.defaultProps = defaultProps;
export default NamespaceOverviewSide;
