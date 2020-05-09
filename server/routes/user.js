import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { buildModels } from 'server/models';

app.get(['/user/:slug', '/user/:slug/:mode'], async (req, res, next) => {
	const { User, Package, Discussion } = await buildModels();
	try {
		const initialData = await getInitialData(req);
		const userData = User.findOne({
			where: { slug: req.params.slug },
			include: [
				{ model: Package, as: 'packages' },
				{ model: Discussion, as: 'discussions' },
			],
		});
		if (!userData) {
			throw new Error('User Not Found');
		}
		if (!req.params.mode) {
			initialData.locationData.params.mode = 'overview';
		}
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
