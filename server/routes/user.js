import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { usersData } from 'stories/data';

app.get(['/user/:slug', '/user/:slug/:mode'], async (req, res, next) => {
	try {
		const initialData = await getInitialData(req);
		const userData = usersData.find((user) => user.slug === req.params.slug);
		if (!userData) {
			throw new Error('User Not Found');
		}
		return renderToNodeStream(
			res,
			<Html
				chunkName="User"
				initialData={initialData}
				viewData={{ userData: userData }}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: `${userData.fullName} · PubPub`,
					description: userData.bio,
					image: userData.avatar,
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
