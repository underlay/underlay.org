import React from 'react';
import PropTypes from 'prop-types';
import { Intent, Tag } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';
import { StandardFrame, NamespaceOverviewMain, NamespaceOverviewSide } from 'components';

const propTypes = {
	userData: PropTypes.object.isRequired,
};

const User = function(props) {
	const { userData } = props;
	const { fullName, avatar, slug, packages, discussions, initials } = userData;
	const { locationData } = usePageContext();
	const { mode } = locationData.params;

	const contentSwitch = {
		overview: {
			main: <NamespaceOverviewMain packages={packages} />,
			side: <NamespaceOverviewSide discussions={discussions} />,
		},
	};
	const activeContent = contentSwitch[mode] || {};
	const { main, side } = activeContent;
	return (
		<StandardFrame
			className="user-container"
			scopeHeaderProps={{
				type: 'user',
				title: fullName,
				avatar: avatar,
				initials: initials,
				detailsTop: slug,
				detailsBottom: (
					<Tag minimal intent={Intent.SUCCESS}>
						Verified: @mjorg
					</Tag>
				),
			}}
			scopeNavProps={{
				navItems: [
					{ slug: 'overview', title: 'Overview' },
					{ slug: 'query', title: 'Query' },
					{ slug: 'discussions', title: 'Discussions' },
				],
			}}
			content={main}
			sideContent={side}
		/>
	);
};

User.propTypes = propTypes;
export default User;
