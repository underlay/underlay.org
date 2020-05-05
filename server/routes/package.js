import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { packagesData, discussionsData, usersData } from 'utils/data';

app.get(['/package/:slug', '/package/:slug/:mode'], async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		let packageData = packagesData.find((pkg) => pkg.slug === req.params.slug);
		if (!packageData) {
			throw new Error('Package Not Found');
		}
		if (!req.params.mode) {
			initialData.locationData.params.mode = 'overview';
		}
		packageData = {
			...packageData,
			packages: packagesData,
			discussions: discussionsData,
			people: usersData,
		};
		return renderToNodeStream(
			res,
			<Html
				chunkName="Package"
				initialData={initialData}
				viewData={{ packageData: packageData }}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${packageData.title} · R1`,
					description: packageData.bio,
					image: packageData.avatar,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
