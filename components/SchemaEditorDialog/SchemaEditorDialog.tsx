import React, { useState } from "react";

import { SchemaEditor, SchemaViewer } from "components";
import { CollectionProps } from "utils/server/collections";
import type { Schema } from "utils/shared/types";

import styles from "./SchemaEditorDialog.module.scss";

type Props = {
	schema: Schema;
	onSchemaChanged: (schema: Schema) => any;
	isEditingWhenOpen?: boolean;
};

const SchemaEditorDialog: React.FC<Props & CollectionProps> = function ({
	collection: initCollection,
	schema,
	onSchemaChanged,
	isEditingWhenOpen = true,
}) {
	const [collection, setCollection] = useState<CollectionProps["collection"]>(initCollection);
	const [isEditing, setIsEditing] = useState<boolean>(
		isEditingWhenOpen || !collection.inputs.length
	);

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
