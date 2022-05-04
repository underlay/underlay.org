import { Button } from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";

import { ThreeColumnFrame } from "components";
import { CollectionProps } from "utils/server/collections";
import { Class, Schema } from "utils/shared/types";

import SchemaClassViewer from "./SchemaClassViewer";
import styles from "./SchemaViewer.module.scss";

type Props = {
	collection: CollectionProps["collection"];
	setIsEditing: (val: boolean) => void;
};

const SchemaViewer: React.FC<Props> = function ({ collection, setIsEditing }) {
	const schema = collection.schemas[0].content as Schema;
	const schemaNodes = schema
		.filter((schemaClass: Class) => {
			return !schemaClass.isRelationship;
		})
		.map((schemaClass: Class) => {
			return { id: schemaClass.id, key: schemaClass.key };
		});

	return (
		<ThreeColumnFrame
			content={
				<div className={styles.viewer}>
					<Tooltip2
						disabled={collection.versions.length === 0}
						content={
							"Editing the schema is disabled until data migrations are implemented"
						}
						className={styles.sticky}
					>
						<Button
							icon="edit"
							text={"Edit"}
							onClick={() => {
								setIsEditing(true);
							}}
							disabled={collection.versions.length > 0} // This is just until we have data-migration backend code in place.
						/>
					</Tooltip2>

					{schema.map((schemaClass) => {
						return (
							<div key={schemaClass.id} className={styles.classWrapper}>
								<SchemaClassViewer
									schemaClass={schemaClass}
									schemaNodes={schemaNodes}
								/>
							</div>
						);
					})}
				</div>
			}
		/>
	);
};

export default SchemaViewer;
