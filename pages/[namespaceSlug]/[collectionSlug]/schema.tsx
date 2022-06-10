import React, { useState } from "react";

import { CollectionHeader, SchemaEditor, SchemaViewer } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";

const CollectionSchema: React.FC<CollectionProps> = function ({ collection: initCollection }) {
	const [collection, setCollection] = useState<CollectionProps["collection"]>(initCollection);
	const [isEditing, setIsEditing] = useState<boolean>(!collection.inputs.length);

	return (
		<div>
			<CollectionHeader mode="schema" collection={collection} />
			{isEditing && (
				<SchemaEditor
					setIsEditing={setIsEditing}
					collection={collection}
					setCollection={setCollection}
				/>
			)}
			{!isEditing && <SchemaViewer setIsEditing={setIsEditing} collection={collection} />}
		</div>
	);
};

export default CollectionSchema;
export const getServerSideProps = getCollectionProps;
