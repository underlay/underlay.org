import React from "react";

import Section from "components/Section";
import CollectionList from "components/CollectionList";
import { Collection } from "components/CollectionPreview";

type Props = {
	collections: Collection[];
};

const Main: React.FC<Props> = function ({ collections }) {
	return (
		<React.Fragment>
			<Section title="Collections">
				<CollectionList collections={collections} />
			</Section>
		</React.Fragment>
	);
};

export default Main;
