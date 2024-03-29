import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionVersions: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="versions" collection={collection} />
			Versions
		</div>
	);
};

export default CollectionVersions;
export const getServerSideProps = getCollectionProps;
