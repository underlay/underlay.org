import React from 'react';
import PropTypes from 'prop-types';
import { Intent, Tag } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';
import { StandardFrame, NamespaceOverviewMain, NamespaceOverviewSide } from 'components';

const propTypes = {
	organizationData: PropTypes.object.isRequired,
};

const Organization = function(props) {
	const { organizationData } = props;
	const { title, avatar, slug, packages, discussions, people } = organizationData;
	const { locationData } = usePageContext();
	const { mode } = locationData.params;

	const contentSwitch = {
		overview: {
			main: <NamespaceOverviewMain packages={packages} />,
			side: (
				<NamespaceOverviewSide discussions={discussions} people={organizationData.people} />
			),
		},
	};
	const activeContent = contentSwitch[mode] || {};
	const { main, side } = activeContent;
	return (
		<StandardFrame
			className="organization-container"
			scopeHeaderProps={{
				type: 'user',
				title: title,
				avatar: avatar,
				detailsTop: slug,
				detailsBottom: (
					<Tag minimal intent={Intent.SUCCESS}>
						Verified: arnold.org
					</Tag>
				),
			}}
			scopeNavProps={{
				navItems: [
					{ slug: 'overview', title: 'Overview' },
					{ slug: 'query', title: 'Query' },
					{ slug: 'people', title: 'People' },
					{ slug: 'discussions', title: 'Discussions' },
				],
			}}
			content={main}
			sideContent={side}
		/>
	);
};

Organization.propTypes = propTypes;
export default Organization;
