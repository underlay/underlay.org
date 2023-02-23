import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";

import { CollectionPageParams } from "utils/shared/types";
import { getCollectionData, getNamespaceData } from "utils/server/queries";
import { makeSlug } from "utils/shared/strings";
import { getLoginId } from "./auth/user";

type ExtendedCollection = Prisma.PromiseReturnType<typeof getCollectionData>;
export type CollectionProps = {
	collection: NonNullable<ExtendedCollection>;
	isOwner?: boolean;
};

export const getCollectionProps: GetServerSideProps<CollectionProps, CollectionPageParams> = async (
	context
) => {
	const { namespaceSlug, collectionSlug } = context.params!;
	const collection = await getCollectionData(collectionSlug);
	const namespaceData = await getNamespaceData(namespaceSlug);
	const loginId = await getLoginId(context.req);

	const isDirectOwner = !!(namespaceData?.user && loginId === namespaceData.user.id);
	const isCommunityOwner = !!(
		namespaceData?.community?.members &&
		namespaceData.community.members.map((m) => m.userId).includes(loginId)
	);

	const isOwner = isDirectOwner || isCommunityOwner;

	if (!collection) {
		return { notFound: true };
	}

	if (!collection.isPublic && !isOwner) {
		return { notFound: true };
	}

	const properRoute = `/${collection.namespace.slug}/${makeSlug(
		collection.slugPrefix,
		collection.slugSuffix
	)}`;
	if (`/${namespaceSlug}/${collectionSlug}` !== properRoute) {
		return {
			redirect: {
				destination: properRoute,
				permanent: false,
			},
		};
	}
	return { props: { collection, isOwner } };
};
