import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { buildModels } from 'server/models';

app.get(['/org/:slug', '/org/:slug/:mode'], async (req, res, next) => {
	const { Organization, Member, Package, User, Discussion } = await buildModels();
	try {
		const initialData = await getInitialData(req);
		const organizationData = Organization.findOne({
			where: { slug: req.params.slug },
			include: [
				{ model: Member, as: 'members', include: [{ model: User, as: 'user' }] },
				{ model: Package, as: 'packages' },
				{ model: Discussion, as: 'discussions' },
			],
		});

		if (!organizationData) {
			throw new Error('Organization Not Found');
		}
		if (!req.params.mode) {
			initialData.locationData.params.mode = 'overview';
		}

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
