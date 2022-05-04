import type { Attribute, Class } from "utils/shared/types";

import styles from "./SchemaAttributeViewer.module.scss";

type Props = {
	isFixed: boolean;
	attribute: Attribute;
	schemaNodes: Partial<Class>[];
};

const SchemaAttributeViewer: React.FC<Props> = function ({ isFixed, attribute, schemaNodes }) {
	return (
		<div className={styles.attribute}>
			<div>{attribute.key}</div>

			{isFixed ? (
				<div>
					{schemaNodes.reduce((prev, sn) => {
						if (sn.id === attribute.type) {
							return sn.key || "";
						}
						return prev;
					}, "")}
				</div>
			) : (
				<div>{attribute.type}</div>
			)}
			{!attribute.isOptional && <div>Required</div>}
			{attribute.isUnique && <div>Unique</div>}
		</div>
	);
};

export default SchemaAttributeViewer;
