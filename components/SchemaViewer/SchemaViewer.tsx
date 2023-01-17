import { Button } from "@blueprintjs/core";

import { ThreeColumnFrame } from "components";
import { Class, Schema } from "utils/shared/types";

import SchemaClassViewer from "./SchemaClassViewer";
import styles from "./SchemaViewer.module.scss";

type Props = {
	schema: Schema;
	setIsEditing: (val: boolean) => void;
};

const SchemaViewer: React.FC<Props> = function ({ schema, setIsEditing }) {
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
					<Button
						className={styles.sticky}
						icon="edit"
						text={"Edit"}
						onClick={() => {
							setIsEditing(true);
						}}
					/>

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
