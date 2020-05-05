import React from 'react';
import PropTypes from 'prop-types';
import { Section, Avatar, DiscussionList } from 'components';

const propTypes = {
	discussions: PropTypes.array.isRequired,
	people: PropTypes.array,
};

const defaultProps = {
	people: [],
};

const NamespaceOverviewSide = function(props) {
	const { discussions, people } = props;

	return (
		<React.Fragment>
			<Section title="Recent Discussions">
				<DiscussionList discussions={discussions} />
			</Section>
			{!!people.length && (
				<Section title="People">
					{people.map((person) => {
						return (
							<a href={`/user/${person.slug}`} key={person.slug}>
								<Avatar
									avatar={person.avatar}
									initials={person.initials}
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
