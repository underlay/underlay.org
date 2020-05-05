import { Landing, Organization, Package, NoMatch, User } from 'containers';

export default (chunkName) => {
	const paths = {
		Landing: {
			ActiveComponent: Landing,
		},
		Organization: {
			ActiveComponent: Organization,
		},
		Package: {
			ActiveComponent: Package,
		},
		NoMatch: {
			ActiveComponent: NoMatch,
			hideFooter: true,
		},
		User: {
			ActiveComponent: User,
		},
	};
	return paths[chunkName];
};
