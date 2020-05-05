import { NoMatch, Landing } from 'containers';

export default (chunkName) => {
	const paths = {
		Landing: {
			ActiveComponent: Landing,
		},
		NoMatch: {
			ActiveComponent: NoMatch,
			hideFooter: true,
		},
	};
	return paths[chunkName];
};
