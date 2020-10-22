import React from "react";

import { Section, CollectionList } from "components/";
import { Collection } from "components/CollectionPreview/CollectionPreview";

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
