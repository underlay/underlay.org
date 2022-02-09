import prisma from "prisma/db";

export const getNamespaceData = async (namespaceSlug: string) => {
	const namespaceData = await prisma.namespace.findUnique({
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

	if (!namespaceData) {
		return undefined;
	}

	const namespace = {
		id: namespaceData.id,
		slug: namespaceData.slug,
		collections: namespaceData.collections,
	};
	const community = namespaceData.community
		? {
				...namespaceData.community,
				namespace,
		  }
		: undefined;
	const user = namespaceData.user
		? {
				...namespaceData.user,
				namespace,
		  }
		: undefined;

	return {
		community,
		user,
	};
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
