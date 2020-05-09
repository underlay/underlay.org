import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { buildModels } from 'server/models';

app.get(
	[
		'/:namespaceSlug/:packageSlug',
		'/:namespaceSlug/:packageSlug/:mode',
		'/:namespaceSlug/:packageSlug/:mode/:subMode',
	],
	async (req, res, next) => {
		const { Package, Discussion, Assertion, User, Organization } = await buildModels();
		try {
			const initialData = await getInitialData(req);
			let packageData = await Package.findOne({
				where: { slug: req.params.packageSlug },
				include: [
					{ model: Discussion, as: 'discussions' },
					{
						model: Assertion,
						as: 'assertions',
						include: [{ model: User, as: 'user' }],
					},
					{ model: User, as: 'user' },
					{ model: Organization, as: 'organization' },
				],
			});
			if (!packageData) {
				throw new Error('Package Not Found');
			}
			const namespaceData = packageData.user || packageData.organization;
			if (namespaceData.slug !== req.params.namespaceSlug) {
				throw new Error('Package Not Found');
			}
			if (!req.params.mode) {
				initialData.locationData.params.mode = 'overview';
			}
			packageData = {
				...packageData.toJSON(),
				namespaceData: namespaceData,
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
	},
);
