import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionConnections: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="connections" collection={collection} />
			Connections
		</div>
	);
};

export default CollectionConnections;
export const getServerSideProps = getCollectionProps;
