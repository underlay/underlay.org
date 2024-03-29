import prisma from "prisma/db";
import { getSlugSuffix } from "utils/shared/strings";

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

type CommunityDataRequest = {
	slug: string;
	includeCollections: boolean;
};
export const getCommunityData = async ({ slug, includeCollections }: CommunityDataRequest) => {
	return prisma.community.findFirst({
		where: {
			namespace: { slug: slug },
		},
		include: {
			members: { include: { user: { include: { namespace: true } } } },
			namespace: {
				include: {
					collections: includeCollections
						? {
								include: {
									versions: true,
								},
						  }
						: false,
				},
			},
		},
	});
};

type UserDataRequest = {
	slug: string;
	includeCollections: boolean;
};
export const getUserData = async ({ slug, includeCollections }: UserDataRequest) => {
	return prisma.user.findFirst({
		where: {
			namespace: { slug: slug },
		},
		include: {
			memberships: { include: { community: { include: { namespace: true } } } },
			namespace: {
				include: {
					collections: includeCollections
						? {
								include: {
									versions: true,
								},
						  }
						: false,
				},
			},
		},
	});
};

export const getCollectionVersionData = async (collectionSlug: string) => {
	return prisma.collection.findUnique({
		where: {
			slugSuffix: getSlugSuffix(collectionSlug),
		},
		include: {
			versions: { orderBy: { createdAt: "desc" } },
		},
	});
};

export const getCollectionData = async (collectionSlug: string) => {
	const collectionData = await prisma.collection.findUnique({
		where: {
			slugSuffix: getSlugSuffix(collectionSlug),
		},
		include: {
			namespace: true,
			exports: {
				include: {
					exportVersions: { include: { version: true } },
					exportUses: { include: { user: true } },
				},
			},
			schemas: { orderBy: { createdAt: "desc" } },
			versions: { orderBy: { createdAt: "desc" } },
			discussionThreads: {
				include: {
					user: {
						include: { namespace: true },
					},
					discussionItems: {
						include: {
							user: {
								include: { namespace: true },
							},
						},
					},
				},
			},
			inputs: {
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					reductionType: true,
					sourceCsv: { include: { user: { include: { namespace: true } } } },
					sourceApi: true,
					createdAt: true,
					outputData: false,
				},
			},
			collaborators: true,
		},
	});
	return collectionData;
};

type SearchRequest = {
	q: string;
};

export const getSearchResults = async ({ q }: SearchRequest) => {
	return prisma.collection.findMany({
		include: {
			namespace: true,
			versions: { orderBy: { createdAt: "desc" } },
		},
		where: {
			OR: [
				{
					namespace: {
						slug: {
							contains: q,
							mode: "insensitive",
						},
					},
				},
				{
					slugPrefix: {
						contains: q,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: q,
						mode: "insensitive",
					},
				},
			],
		},
	});
};
