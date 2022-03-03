import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionDiscussions: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />
			Discussions
		</div>
	);
};

export default CollectionDiscussions;
export const getServerSideProps = getCollectionProps;
