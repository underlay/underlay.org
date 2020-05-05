import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { organizationsData, packagesData, discussionsData, usersData } from 'utils/data';

app.get(['/org/:slug', '/org/:slug/:mode'], async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		let organizationData = organizationsData.find((org) => org.slug === req.params.slug);
		if (!organizationData) {
			throw new Error('Organization Not Found');
		}
		if (!req.params.mode) {
			initialData.locationData.params.mode = 'overview';
		}
		organizationData = {
			...organizationData,
			packages: packagesData,
			discussions: discussionsData,
			people: usersData,
		};
		return renderToNodeStream(
			res,
			<Html
				chunkName="Organization"
				initialData={initialData}
				viewData={{ organizationData: organizationData }}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${organizationData.title} · R1`,
					description: organizationData.bio,
					image: organizationData.avatar,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
