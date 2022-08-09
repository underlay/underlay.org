import { CollectionHeader, DiscussionThreadNew, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { makeSlug } from "utils/shared/strings";

const CollectionNewDiscussion: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />

			<ThreeColumnFrame
				content={
					<DiscussionThreadNew
						collectionId={collection.id}
						redirectPath={`/${collection.namespace.slug}/${makeSlug(
							collection.slugPrefix,
							collection.slugSuffix
						)}`}
					/>
				}
			/>
		</div>
	);
};

export default CollectionNewDiscussion;
export const getServerSideProps = getCollectionProps;
