import React from 'react';
import PropTypes from 'prop-types';
import { Intent, Tag } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';
import { buildUrl } from 'utils/urls';
import { StandardFrame, NamespaceOverviewMain, NamespaceOverviewSide } from 'components';

const propTypes = {
	organizationData: PropTypes.object.isRequired,
};

const Organization = function(props) {
	const { organizationData } = props;
	const { title, avatar, slug, packages, discussions, members } = organizationData;
	const { locationData } = usePageContext();
	const { mode } = locationData.params;

	const contentSwitch = {
		overview: {
			main: <NamespaceOverviewMain packages={packages} />,
			side: <NamespaceOverviewSide discussions={discussions} members={members} />,
		},
	};
	const activeContent = contentSwitch[mode] || {};
	const { main, side } = activeContent;
	return (
		<StandardFrame
			className="organization-container"
			scopeHeaderProps={{
				type: 'org',
				title: (
					<a href={buildUrl({ namespaceSlug: slug })} className="hoverline">
						{title}
					</a>
				),
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
					{
						slug: 'discussions',
						title: 'Discussions',
						children: [
							{ slug: 'open', title: 'Open' },
							{ slug: 'closed', title: 'Closed' },
						],
					},
				],
			}}
			content={main}
			sideContent={side}
		/>
	);
};

Organization.propTypes = propTypes;
export default Organization;
