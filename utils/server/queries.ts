import prisma from "prisma/db";

export const getNamespaceData = (namespaceSlug: string) => {
	return prisma.namespace.findUnique({
		where: { slug: namespaceSlug },
		include: {
			collections: true,
			community: {
				include: {
					members: { include: { user: { include: { namespace: true } } } },
				},
			},
			user: {
				include: {
					namespace: true,
					memberships: { include: { community: { include: { namespace: true } } } },
				},
			},
		},
	});
};

export const getCollectionData = async (namespaceSlug: string, collectionSlug: string) => {
	const profileData = await prisma.namespace.findUnique({
		where: { slug: namespaceSlug },
		include: {
			collections: {
				where: {
					slug: collectionSlug,
				},
			},
		},
	});
	return profileData?.collections[0];
};
