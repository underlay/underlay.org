import React from 'react';
import Html from 'server/Html';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { buildModels } from 'server/models';
import app from 'server/server';

app.get('/', async (req, res, next) => {
	try {
		const { User, Package, Organization } = await buildModels();
		const usersData = await User.findAll();
		const packagesData = await Package.findAll({
			include: [
				{ model: User, as: 'user' },
				{ model: Organization, as: 'organization' },
			],
		});
		const organizationsData = await Organization.findAll();
		const initialData = await getInitialData(req);
		return renderToNodeStream(
			res,
			<Html
				chunkName="Landing"
				initialData={initialData}
				viewData={{
					usersData: usersData,
					packagesData: packagesData,
					organizationsData: organizationsData,
				}}
				headerComponents={generateMetaComponents({
					initialData: initialData,
					title: 'R1',
					description: 'Underlay Registry #1',
				})}
			/>,
		);
	} catch (err) {
		return handleErrors(req, res, next)(err);
	}
});
