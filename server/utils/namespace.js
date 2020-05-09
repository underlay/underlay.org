import { buildModels } from 'server/models';

export const findNamespace = async (slug) => {
	const { User, Organization, Member, Discussion, Package } = await buildModels();
	let userData = await User.findOne({
		where: { slug: slug },
		include: [
			{ model: Package, as: 'packages' },
			{ model: Discussion, as: 'discussions' },
		],
	});
	if (userData) {
		userData = userData.toJSON();
	}
	let organizationData = await Organization.findOne({
		where: { slug: slug },
		include: [
			{ model: Member, as: 'members', include: [{ model: User, as: 'user' }] },
			{ model: Package, as: 'packages' },
			{ model: Discussion, as: 'discussions' },
		],
	});
	if (organizationData) {
		organizationData = organizationData.toJSON();
	}
	return Promise.all([userData, organizationData]);
};
