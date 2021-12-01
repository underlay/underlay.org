import prisma from "prisma/db";

export const getProfileData = (profileSlug: string) => {
	return prisma.profile.findUnique({
		where: { slug: profileSlug },
		include: {
			community: {
				include: {
					members: { include: { user: { include: { profile: true } } } },
					collections: true,
				},
			},
			user: {
				include: {
					profile: true,
					memberships: { include: { community: { include: { profile: true } } } },
					collections: true,
				},
			},
		},
	});
};

export const getCollectionData = (profileSlug: string, collectionSlug: string) => {
	return prisma.profile.findUnique({
		where: { slug: profileSlug },
		include: {
			community: {
				include: {
					members: true,
					collections: {
						where: {
							slug: collectionSlug,
						},
					},
				},
			},
		},
	});
};
