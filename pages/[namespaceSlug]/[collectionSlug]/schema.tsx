import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionSchema: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="schema" collection={collection} />
			Schema
		</div>
	);
};

export default CollectionSchema;
export const getServerSideProps = getCollectionProps;
