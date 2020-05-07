export const users = [
	{
		slug: 'mar',
		fullName: 'Margaret Owens',
		avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?&w=100&h=100&fit=crop',
	},
	{ slug: 'foo', fullName: 'Foolnar Morb', initials: 'FM' },
	{
		slug: 'john',
		fullName: 'John Darrens',
		avatar:
			'https://images.unsplash.com/photo-1521587765099-8835e7201186?&w=100&h=100&fit=crop',
	},
	{
		slug: 'stayn',
		fullName: 'Stayn Drelo',
		avatar:
			'https://images.unsplash.com/photo-1521146764736-56c929d59c83?&w=100&h=100&fit=crop',
	},
	{
		slug: 'pvid',
		fullName: 'Peter Vidloski',
		avatar:
			'https://images.unsplash.com/photo-1542393881816-df51684879df?&w=100&h=100&fit=crop',
	},
	{
		slug: 'acalli',
		fullName: 'Alex Callister',
		avatar: 'https://images.unsplash.com/photo-1551069613-1904dbdcda11?&w=100&h=100&fit=crop',
	},
];

export const organizations = [
	{
		slug: 'arnold-foundation',
		title: 'Arnold Foundation',
		avatar:
			'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?&w=100&h=100&fit=crop',
	},
	{
		slug: 'futures',
		title: 'Future Collective',
		avatar:
			'https://images.unsplash.com/photo-1587987501183-33e43fdde781?&w=100&h=100&fit=crop',
	},
];

export const buildMembers = (usersData, orgsData) => {
	return [
		{
			userId: usersData[1].id,
			organizationId: orgsData[0].id,
		},
		{
			userId: usersData[0].id,
			organizationId: orgsData[0].id,
		},
		{
			userId: usersData[2].id,
			organizationId: orgsData[0].id,
		},
		{
			userId: usersData[1].id,
			organizationId: orgsData[1].id,
		},
	];
};

export const buildPackages = (usersData, orgsData) => {
	return [
		{
			slug: 'biography',
			description: 'Basic biography data for this person.',
			userId: usersData[2].id,
		},
		{
			slug: 'filmography',
			description: 'Complete list of films crediting.',
			organizationId: orgsData[1].id,
		},
		{
			slug: 'career-stats',
			description: 'Professional stats for lifetime collection.',
			userId: usersData[4].id,
		},
	];
};

export const buildDiscussions = (usersData, orgsData, packagesData) => {
	return [
		{
			number: 1,
			title: 'Considering alternative schemas',
			authorId: usersData[0].id,
			packageId: packagesData[0].id,
		},
		{
			number: 2,
			title: 'Open tools',
			authorId: usersData[1].id,
			packageId: packagesData[0].id,
		},
		{
			number: 3,
			title: 'More ideas',
			authorId: usersData[2].id,
			packageId: packagesData[0].id,
		},
		{
			number: 1,
			title: 'Feeding pandas with food',
			authorId: usersData[3].id,
			organizationId: orgsData[0].id,
		},
		{
			number: 1,
			title: 'Fish swim in water',
			authorId: usersData[3].id,
			userId: usersData[2].id,
		},
	];
};

export const buildAssertions = (usersData, packagesData) => {
	return [
		{ hash: 'bc235a', numGraphs: 12, userId: usersData[4].id, packageId: packagesData[0].id },
		{ hash: 'cc23da', numGraphs: 4, userId: usersData[3].id, packageId: packagesData[0].id },
		{ hash: '56aadb', numGraphs: 1, userId: usersData[1].id, packageId: packagesData[0].id },
		{ hash: 'a2bc34', numGraphs: 2, userId: usersData[2].id, packageId: packagesData[1].id },
		{ hash: 'cbda11', numGraphs: 3, userId: usersData[3].id, packageId: packagesData[2].id },
		{ hash: 'ee2cad', numGraphs: 1, userId: usersData[0].id, packageId: packagesData[2].id },
	];
};
