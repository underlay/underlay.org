import React, { useState } from "react";

import {
	CollectionHeader,
	CollectionOverviewMain,
	CollectionOverviewSide,
	ThreeColumnFrame,
} from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionOverview: React.FC<CollectionProps> = function ({
	collection: initCollection,
	isOwner,
}) {
	const [collection, setCollection] = useState(initCollection);

	return (
		<div>
			<CollectionHeader mode="overview" collection={collection} />
			<ThreeColumnFrame
				content={
					<CollectionOverviewMain
						collection={collection}
						setCollection={setCollection}
						isOwner={isOwner}
					/>
				}
				sideContent={<CollectionOverviewSide collection={collection} />}
			/>
		</div>
	);
};

export default CollectionOverview;
export const getServerSideProps = getCollectionProps;
