import { Prisma } from "@prisma/client";
import { GetServerSideProps } from "next";

import { CollectionPageParams } from "utils/shared/types";
import { getCollectionData } from "utils/server/queries";

type ExtendedCollection = Prisma.PromiseReturnType<typeof getCollectionData>;
export type CollectionProps = {
	collection: NonNullable<ExtendedCollection>;
};

export const getCollectionProps: GetServerSideProps<CollectionProps, CollectionPageParams> = async (
	context
) => {
	const { namespaceSlug, collectionSlug } = context.params!;
	const collection = await getCollectionData(namespaceSlug, collectionSlug);

	if (!collection) {
		return { notFound: true };
	}
	return { props: { collection } };
};
