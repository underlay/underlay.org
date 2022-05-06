import { Schema } from "utils/shared/types";

export const getClassKeyById = (classId: string, schema: Schema): string => {
	const foundClass = schema.find((schemaClass) => {
		return schemaClass.id === classId;
	});
	if (!foundClass) {
		return undefined;
	}
	return foundClass.key;
};
