import React from 'react';
import PropTypes from 'prop-types';
import { Intent, Tag } from '@blueprintjs/core';
import { usePageContext } from 'client/utils/hooks';
import { StandardFrame, PackageOverviewMain, PackageOverviewSide } from 'components';

const propTypes = {
	packageData: PropTypes.object.isRequired,
};

const Package = function(props) {
	const { packageData } = props;
	const { title, avatar, slug, contributors, namespaceData } = packageData;
	const { locationData } = usePageContext();
	const { mode } = locationData.params;

	const contentSwitch = {
		overview: {
			main: <PackageOverviewMain />,
			side: <PackageOverviewSide contributors={contributors} />,
		},
	};
	const activeContent = contentSwitch[mode] || {};
	const { main, side } = activeContent;
	return (
		<StandardFrame
			className="package-container"
			scopeHeaderProps={{
				type: 'package',
				title: `${namespaceData.slug}/${title}`,
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
					{
						slug: 'overview',
						title: 'Overview',
					},
					{ slug: 'query', title: 'Query' },
					{
						slug: 'content',
						title: 'Content',
						children: [
							{ slug: 'overview', title: 'Overview' },
							{ slug: 'assertions', title: 'Assertions' },
							{ slug: 'files', title: 'Files' },
							{ slug: 'versions', title: 'Versions' },
						],
					},

					{
						slug: 'discussions',
						title: 'Discussions',
						children: [
							{ slug: 'open', title: 'Open' },
							{ slug: 'closed', title: 'Closed' },
						],
					},
					{
						slug: 'suggestions',
						title: 'Suggestions',
						children: [
							{ slug: 'open', title: 'Open' },
							{ slug: 'closed', title: 'Closed' },
						],
					},
					{
						slug: 'network',
						title: 'Network',
						children: [
							{ slug: 'contributors', title: 'Contributors' },
							{ slug: 'dependencies', title: 'Dependencies' },
							{ slug: 'dependants', title: 'Dependants' },
						],
					},
				],
			}}
			content={main}
			sideContent={side}
		/>
	);
};

Package.propTypes = propTypes;
export default Package;
