import React from "react";
import { Icon } from "@blueprintjs/core";

import type { Class } from "utils/shared/types";

import SchemaAttributeViewer from "./SchemaAttributeViewer";
import styles from "./SchemaClassViewer.module.scss";

type Props = {
	schemaClass: Class;
	schemaNodes: Partial<Class>[];
};

const SchemaClassViewer: React.FC<Props> = function ({ schemaClass, schemaNodes }) {
	return (
		<div className={styles.schemaClass}>
			<div className={styles.classHeader}>
				<Icon icon={schemaClass.isRelationship ? "arrow-top-right" : "circle"} />

				<div>{schemaClass.key}</div>
			</div>
			{schemaClass.attributes.map((attribute, index) => {
				return (
					<div key={attribute.id} className={styles.attributeWrapper}>
						<SchemaAttributeViewer
							isFixed={index < 2 && !!schemaClass.isRelationship}
							attribute={attribute}
							schemaNodes={schemaNodes}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default SchemaClassViewer;
