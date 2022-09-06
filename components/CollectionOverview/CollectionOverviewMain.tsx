import React from "react";

import { Section, CollectionOverviewTimeline } from "components";
import { CollectionProps } from "utils/server/collections";
import ReadmeSection from "./ReadmeSection";

type Props = CollectionProps & {
	setCollection: any;
};

const CollectionOverviewMain: React.FC<Props> = function ({ collection, setCollection }) {
	return (
		<React.Fragment>
			<ReadmeSection collection={collection} setCollection={setCollection} />
			<Section title="Timeline">
				<CollectionOverviewTimeline collection={collection} />
			</Section>
		</React.Fragment>
	);
};

export default CollectionOverviewMain;
