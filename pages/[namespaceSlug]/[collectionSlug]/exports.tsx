import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionExports: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="exports" collection={collection} />
			Exports
		</div>
	);
};

export default CollectionExports;
export const getServerSideProps = getCollectionProps;
