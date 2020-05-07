import React from 'react';
import Html from 'server/Html';
import app from 'server/server';
import { renderToNodeStream, generateMetaComponents } from 'server/utils/ssr';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { User, Organization, Member, Discussion, Package } from 'server/models';

export const findNamespace = (slug) => {
	const userData = User.findOne({
		where: { slug: slug },
		include: [
			{ model: Package, as: 'packages' },
			{ model: Discussion, as: 'discussions' },
		],
	});
	const organizationData = Organization.findOne({
		where: { slug: slug },
		include: [
			{ model: Member, as: 'members', include: [{ model: User, as: 'user' }] },
			{ model: Package, as: 'packages' },
			{ model: Discussion, as: 'discussions' },
		],
	});

	return Promise.all([userData, organizationData]);
};

const renderUserView = (res, initialData, userData) => {
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
};

const renderOrgView = (res, initialData, organizationData) => {
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
};

app.get(
	['/:namespaceSlug', '/:namespaceSlug/:mode', '/:namespaceSlug/:mode/:subMode'],
	async (req, res, next) => {
		try {
			const initialData = await getInitialData(req);
			if (!req.params.mode) {
				initialData.locationData.params.mode = 'overview';
			}
			const [userData, organizationData] = await findNamespace(req.params.namespaceSlug);
			if (!userData && !organizationData) {
				throw new Error('Namespace Not Found');
			}
			return userData
				? renderUserView(res, initialData, userData)
				: renderOrgView(res, initialData, organizationData);
		} catch (err) {
			return handleErrors(req, res, next)(err);
		}
	},
);
