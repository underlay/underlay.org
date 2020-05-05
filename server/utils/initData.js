import queryString from 'query-string';

export const getInitialData = async (req) => {
	/* Gather user data */
	const user = req.user || {
		avatar: 'https://images.unsplash.com/photo-1502378735452-bc7d86632805?&w=50&h=50&fit=crop',
	};
	const loginData = {
		id: user.id || null,
		initials: user.initials,
		slug: user.slug,
		fullName: user.fullName,
		firstName: user.firstName,
		lastName: user.lastName,
		avatar: user.avatar,
		title: user.title,
	};

	/* Gather location data */
	const locationData = {
		hostname: req.hostname,
		path: req.path,
		params: req.params,
		query: req.query,
		queryString: req.query ? `?${queryString.stringify(req.query)}` : '',
	};

	return {
		loginData: loginData,
		locationData: locationData,
	};
};
