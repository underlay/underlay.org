import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { usersData, organizationsData, packagesData, discussionsData } from 'utils/data';

export const findNamespace = (slug) => {
	let organizationData = organizationsData.find((org) => org.slug === slug);
	if (organizationData) {
		organizationData = {
			...organizationData,
			packages: packagesData,
			discussions: discussionsData,
			people: usersData.slice(0, 3),
		};
	}
	let userData = usersData.find((user) => user.slug === slug);
	if (userData) {
		userData = {
			...userData,
			packages: packagesData,
			discussions: discussionsData,
		};
	}
	return [userData, organizationData];
};

app.get(
	[
		'/:namespaceSlug/:packageSlug',
		'/:namespaceSlug/:packageSlug/:mode',
		'/:namespaceSlug/:packageSlug/:mode/:subMode',
	],
	async (req, res, next) => {
		try {
			const initialData = await getInitialData(req);
			const [userData, organizationData] = findNamespace(req.params.namespaceSlug);
			if (!userData && !organizationData) {
				throw new Error('Namespace Not Found');
			}
			let packageData = packagesData.find((pkg) => pkg.slug === req.params.packageSlug);
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
				contributors: usersData,
				namespaceData: userData || organizationData,
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
