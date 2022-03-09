import React, { useState } from "react";

import { CollectionHeader } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import CollectionOverviewMain from "components/CollectionOverview/CollectionOverviewMain";
import CollectionOverviewSide from "components/CollectionOverview/CollectionOverviewSide";
import ThreeColumnFrame from "components/ThreeColumnFrame/ThreeColumnFrame";

const CollectionOverview: React.FC<CollectionProps> = function ({ collection: initCollection }) {
	const [collection, setCollection] = useState(initCollection);

	return (
		<div>
			<CollectionHeader mode="overview" collection={collection} />
			<ThreeColumnFrame
				content={
					<CollectionOverviewMain collection={collection} setCollection={setCollection} />
				}
				sideContent={<CollectionOverviewSide collection={collection} />}
			/>
		</div>
	);
};

export default CollectionOverview;
export const getServerSideProps = getCollectionProps;
