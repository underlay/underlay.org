import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";

import { CollectionPageParams } from "utils/shared/types";
import { getCollectionData } from "utils/server/queries";
import { makeSlug } from "utils/shared/strings";

type ExtendedCollection = Prisma.PromiseReturnType<typeof getCollectionData>;
export type CollectionProps = {
	collection: NonNullable<ExtendedCollection>;
};

export const getCollectionProps: GetServerSideProps<CollectionProps, CollectionPageParams> = async (
	context
) => {
	const { namespaceSlug, collectionSlug } = context.params!;
	const collection = await getCollectionData(collectionSlug);

	if (!collection) {
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
	return { props: { collection } };
};
