import React from "react";
// import { GetServerSideProps } from "next";
// import { getInitData } from "pages/api/init";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import { Button } from '@blueprintjs/core';

const Collection = () => {
	return (
		<div>
			In Collection Page
			
		</div>
	);
};

export default Collection;

// export const getServerSideProps: GetServerSideProps = async (context) => {
// 	const initData = await getInitData(context.req);
// 	const { ownerSlug, collectionSlug } = context.params;
// 	return { props: { initData: initData } };
// };

// import React from 'react';
// import PropTypes from 'prop-types';
// import { Intent, Tag } from '@blueprintjs/core';
// import { usePageContext } from 'client/utils/hooks';
// import { buildUrl } from 'utils/urls';
// import { StandardFrame, PackageOverviewMain, PackageOverviewSide } from 'components';

// const propTypes = {
// 	packageData: PropTypes.object.isRequired,
// };

// const Package = function(props) {
// 	const { packageData } = props;
// 	const { avatar, slug, assertions, namespaceData } = packageData;
// 	const { locationData } = usePageContext();
// 	const { mode } = locationData.params;

// 	const contentSwitch = {
// 		overview: {
// 			main: <PackageOverviewMain />,
// 			side: <PackageOverviewSide contributors={assertions.map((as) => as.user)} />,
// 		},
// 	};
// 	const activeContent = contentSwitch[mode] || {};
// 	const { main, side } = activeContent;
// 	return (
// 		<StandardFrame
// 			className="package-container"
// 			scopeHeaderProps={{
// 				type: 'package',
// 				title: (
// 					<span>
// 						<a
// 							href={buildUrl({ namespaceSlug: namespaceData.slug })}
// 							className="hoverline"
// 						>
// 							{namespaceData.slug}
// 						</a>
// 						/
// 						<a
// 							href={buildUrl({
// 								namespaceSlug: namespaceData.slug,
// 								packageSlug: slug,
// 							})}
// 							className="hoverline"
// 						>
// 							{slug}
// 						</a>
// 					</span>
// 				),
// 				avatar: avatar,
// 				detailsTop: slug,
// 				detailsBottom: (
// 					<Tag minimal intent={Intent.SUCCESS}>
// 						Verified: arnold.org
// 					</Tag>
// 				),
// 			}}
// 			scopeNavProps={{
// 				navItems: [
// 					{
// 						slug: 'overview',
// 						title: 'Overview',
// 					},
// 					{ slug: 'query', title: 'Query' },
// 					{
// 						slug: 'content',
// 						title: 'Content',
// 						children: [
// 							{ slug: 'assertions', title: 'Assertions' },
// 							{ slug: 'files', title: 'Files' },
// 							{ slug: 'versions', title: 'Versions' },
// 						],
// 					},
// 					{
// 						slug: 'discussions',
// 						title: 'Discussions',
// 						children: [
// 							{ slug: 'open', title: 'Open' },
// 							{ slug: 'closed', title: 'Closed' },
// 						],
// 					},
// 					{
// 						slug: 'suggestions',
// 						title: 'Suggestions',
// 						children: [
// 							{ slug: 'open', title: 'Open' },
// 							{ slug: 'closed', title: 'Closed' },
// 						],
// 					},
// 					{
// 						slug: 'network',
// 						title: 'Network',
// 						children: [
// 							{ slug: 'contributors', title: 'Contributors' },
// 							{ slug: 'dependencies', title: 'Dependencies' },
// 							{ slug: 'dependants', title: 'Dependants' },
// 						],
// 					},
// 				],
// 			}}
// 			content={main}
// 			sideContent={side}
// 		/>
// 	);
// };

// Package.propTypes = propTypes;
// export default Package;
