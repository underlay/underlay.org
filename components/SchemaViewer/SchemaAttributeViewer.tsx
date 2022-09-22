import type { Attribute, Class } from "utils/shared/types";

type Props = {
	isFixed: boolean;
	attribute: Attribute;
	schemaNodes: Partial<Class>[];
};

const SchemaAttributeViewer: React.FC<Props> = function ({ isFixed, attribute, schemaNodes }) {
	return (
		<>
			<span>{attribute.key}</span>

			{isFixed ? (
				<span>
					{schemaNodes.reduce((prev, sn) => {
						if (sn.id === attribute.type) {
							return sn.key || "";
						}
						return prev;
					}, "")}
				</span>
			) : (
				<span>{attribute.type}</span>
			)}
			{!attribute.isOptional && <span>Required</span>}
			{attribute.isUID && <span>Unique Identifier</span>}
		</>
	);
};

export default SchemaAttributeViewer;
