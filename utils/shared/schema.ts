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
