import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { usersData, packagesData, discussionsData } from 'utils/data';

app.get(['/user/:slug', '/user/:slug/:mode'], async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		let userData = usersData.find((user) => user.slug === req.params.slug);
		if (!userData) {
			throw new Error('User Not Found');
		}
		if (!req.params.mode) {
			initialData.locationData.params.mode = 'overview';
		}
		userData = { ...userData, packages: packagesData, discussions: discussionsData };
		return renderToNodeStream(
			res,
			<Html
				chunkName="User"
				initialData={initialData}
				viewData={{ userData: userData }}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${userData.fullName} · R1`,
					description: userData.bio,
					image: userData.avatar,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
