import React, { useState } from "react";

import { SchemaEditor, SchemaViewer } from "components";
import { CollectionProps } from "utils/server/collections";
import type { Schema } from "utils/shared/types";

import styles from "./SchemaEditorDialog.module.scss";

type Props = {
	onSchemaChanged: (schema: Schema) => any;
	schema: Schema;
};

const SchemaEditorDialog: React.FC<Props & CollectionProps> = function ({
	collection: initCollection,
	schema,
	onSchemaChanged,
}) {
	const [collection, setCollection] = useState<CollectionProps["collection"]>(initCollection);
	const [isEditing, setIsEditing] = useState<boolean>(!collection.inputs.length);

	return (
		<div className={styles.editorFrame}>
			{isEditing && (
				<SchemaEditor
					collection={collection}
					schema={schema}
					setIsEditing={setIsEditing}
					setCollection={setCollection}
					onSchemaChanged={onSchemaChanged}
				/>
			)}
			{!isEditing && <SchemaViewer setIsEditing={setIsEditing} schema={schema} />}
		</div>
	);
};

export default SchemaEditorDialog;
