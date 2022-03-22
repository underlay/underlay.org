import React from "react";

import { CollectionHeader, SchemaEditor } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { Schema } from "utils/shared/types";

const CollectionSchema: React.FC<CollectionProps> = function ({ collection }) {
	return (
		<div>
			<CollectionHeader mode="schema" collection={collection} />
			<SchemaEditor
				collectionId={collection.id}
				version={collection.version}
				schema={collection.schema as Schema}
			/>
		</div>
	);
};

export default CollectionSchema;
export const getServerSideProps = getCollectionProps;
