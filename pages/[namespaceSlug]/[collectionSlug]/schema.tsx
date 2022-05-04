import React, { useState } from "react";

import { CollectionHeader, SchemaEditor } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
// import { Schema } from "utils/shared/types";

const CollectionSchema: React.FC<CollectionProps> = function ({ collection: initCollection }) {
	const [collection, setCollection] = useState(initCollection);
	const [isEditing, setIsEditing] = useState(!!collection.version);
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
			{!isEditing && (
				<button
					onClick={() => {
						setIsEditing(true);
					}}
				>
					Edit
				</button>
			)}
		</div>
	);
};

export default CollectionSchema;
export const getServerSideProps = getCollectionProps;
