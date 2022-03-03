import React from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionSettings: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="settings" collection={collection} />
			Settings
		</div>
	);
};

export default CollectionSettings;
export const getServerSideProps = getCollectionProps;
