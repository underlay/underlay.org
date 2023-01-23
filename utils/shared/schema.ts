import { Schema, Class } from "utils/shared/types";

export const getClassKeyById = (classId: string, schema: Schema): string | undefined => {
	const foundClass = schema.find((schemaClass) => {
		return schemaClass.id === classId;
	});
	if (!foundClass) {
		return undefined;
	}
	return foundClass.key;
};

export const splitClasses = (schema: Schema) => {
	const nodes: Class[] = [];
	const relationships: Class[] = [];
	schema.forEach((schemaClass) => {
		if (schemaClass.isRelationship) {
			relationships.push(schemaClass);
		} else {
			nodes.push(schemaClass);
		}
	});
	return { nodes, relationships };
};

/**
 * Convert schema as-is to a default mapping
 */
export const schemaToMapping = (schema: Schema) => {
	const mapping: { [key: string]: any } = {};
	schema.forEach((schemaClass) => {
		const classMap = {
			include: true,
			rename: "",
			attributes: {} as { [key: string]: any },
		};
		schemaClass.attributes.forEach((attr) => {
			classMap.attributes[attr.key] = {
				include: true,
				rename: "",
			};
		});
		mapping[schemaClass.key] = classMap;
	});

	return mapping;
};
