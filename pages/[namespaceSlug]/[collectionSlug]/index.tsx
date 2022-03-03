import React from "react";

import {
	CollectionOverviewMain,
	CollectionOverviewSide,
	CollectionHeader,
	ThreeColumnFrame,
} from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionOverview: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="overview" collection={collection} />
			<ThreeColumnFrame
				content={<CollectionOverviewMain collection={collection} />}
				sideContent={<CollectionOverviewSide collection={collection} />}
			/>
		</div>
	);
};

export default CollectionOverview;
export const getServerSideProps = getCollectionProps;
