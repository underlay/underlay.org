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

			<Section title="Activity">-- Add Inputs, versions, comments in a timeline here</Section>
			{/* <Section title="Data"> */}
			{/* <img
					width="100%"
					src="https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/20223645ee209717b4c6f7c874bedd96.png"
				/> */}
			{/* <Editor collection={collection} /> */}
			{/* </Section> */}

			<Section title="Timeline">
        <CollectionOverviewTimeline collection={collection} />
			</Section>
		</React.Fragment>
	);
};

export default CollectionOverviewMain;
