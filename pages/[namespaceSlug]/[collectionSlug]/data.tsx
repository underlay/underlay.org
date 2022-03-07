import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionData: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="data" collection={collection} />
			Data
		</div>
	);
};

export default CollectionData;
export const getServerSideProps = getCollectionProps;
