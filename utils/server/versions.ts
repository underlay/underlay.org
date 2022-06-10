import { Input } from "@prisma/client";
import { splitClasses } from "utils/shared/schema";
import { Schema } from "utils/shared/types";
import { getServerSupabase } from "./supabase";

export const updateDraftVersion = async (
	inputObject: Input,
	slugSuffix: string,
	schema: Schema
) => {
	/* Merge it with past values */
	// Load/check current draft.json
	// OutputData has the same shape as version files, and a version file is just a reduction
	// of all outputData blobs up to the point of a version publication.
	const supabase = getServerSupabase();
	const reductionType = inputObject.reductionType as "concat" | "merge" | "overwrite";
	const reductionFunctions = {
		merge: mergeJsons,
		concat: concatJsons,
		overwrite: overwriteJsons,
	};
	const reductionFunc = reductionFunctions[reductionType];

	const { data, error: err } = await supabase.storage
		.from("data")
		.download(`${slugSuffix}/versions/draft.json`);
	const dataString = await data?.text();
	const oldData = err ? {} : JSON.parse(dataString);
	const nextData = reductionFunc(schema, oldData, inputObject.outputData);

	/* Connect to supabase and set filepath */
	const fileName = `draft.json`;
	const filepath = `${slugSuffix}/versions/${fileName}`;

	/* Overwrite the file on supabase */
	const { error } = await supabase.storage
		.from("data")
		.upload(filepath, JSON.stringify(nextData), {
			cacheControl: "0",
			upsert: true,
		});
	if (error) {
		throw error;
	}
	/* return success */
	return true;
};

const getAllClassKeys = (oldJson: {}, newJson: {}): string[] => {
	return [...new Set([...Object.keys(oldJson), ...Object.keys(newJson)])];
};

const entityHasUpdated = (
	oldObject: {},
	newObject: {},
	isRelationship: boolean = false
): boolean => {
	return Object.keys(newObject).some((newObjectKey) => {
		const relationshipIgnoreKeys = isRelationship ? ["source", "target"] : [];
		const ignoreKeys = ["_ulid", "_ulprov", ...relationshipIgnoreKeys];
		if (ignoreKeys.includes(newObjectKey)) {
			return false;
		}
		if (newObject[newObjectKey] !== oldObject[newObjectKey]) {
			/* If the new object has an updated value */
			return true;
		}
		return false;
	});
};

export const overwriteJsons = (_schema: Schema, _oldJson: {}, newJson: {}) => {
	return newJson;
};

export const concatJsons = (_schema: Schema, oldJson: {}, newJson: {}) => {
	const nextData = {};
	const allClassKeys = getAllClassKeys(oldJson, newJson);

	allClassKeys.forEach((outputDataClassKey) => {
		const newEntities = newJson[outputDataClassKey] || [];
		const previousEntities = oldJson[outputDataClassKey] || [];
		nextData[outputDataClassKey] = [...previousEntities, ...newEntities];
	});
	return nextData;
};

export const mergeJsons = (schema: Schema, oldJson: {}, newJson: {}) => {
	/* 
	- Run concat on data
	- Iterate through all node classKeys
		- Iterate through all entities
		- Check if their uniqueId or ulid is key in an object
		- If not, put into object
		- If yes, {..old, ...new, ulId: oldid, prov: `${oldEntity._ulprov},${newEntity._ulprov}`}
		- If yes, add to object mapping oldId: newId (will be used for relationships)
		- Add ulId to validNodeIds list
	- Iterate through all relationship classKeys
		- Iterate through all attributes
		- Check that sourceId and targetId are valid ids
		- Check if their source+target or source+target+uniqueId is in an object
		- if no, add to object
		- if yes, {..old, ...new, ulId: oldid, prov: `${oldEntity._ulprov},${newEntity._ulprov}`, source: properSource, target: properTarget }
		
	*/
	const nextData = {};
	const concattedData = concatJsons(schema, oldJson, newJson);
	const { nodes: nodeClasses, relationships: relationshipClasses } = splitClasses(schema);
	const idMap = {};
	nodeClasses.forEach((nodeClass) => {
		const entityByUniqueValue = {};
		const classKey = nodeClass.key;
		const classData = concattedData[classKey];
		if (!classData) {
			return;
		}
		const uniqueAttr = nodeClass.attributes.find((attr) => {
			return attr.isUID;
		});
		const uniqueAttrKey = uniqueAttr?.key;
		classData.forEach((entity) => {
			const uniqueValue = uniqueAttrKey ? entity[uniqueAttrKey] : entity._ulid;
			const existingEntity = entityByUniqueValue[uniqueValue];
			if (existingEntity) {
				idMap[entity._ulid] = existingEntity._ulid;
				entityByUniqueValue[uniqueValue] = {
					...existingEntity,
					...entity,
					_ulid: existingEntity._ulid,
					_ulprov: entityHasUpdated(existingEntity, entity)
						? `${existingEntity._ulprov},${entity._ulprov}`
						: existingEntity._ulprov,
				};
			} else {
				idMap[entity._ulid] = entity._ulid;
				entityByUniqueValue[uniqueValue] = entity;
			}
		});
		nextData[classKey] = Object.values(entityByUniqueValue);
	});

	relationshipClasses.forEach((relationshipClass) => {
		const entityByUniqueValue = {};
		const classKey = relationshipClass.key;
		const classData = concattedData[classKey];
		if (!classData) {
			return;
		}
		const uniqueAttr = relationshipClass.attributes.find((attr) => {
			return attr.isUID;
		});
		const uniqueAttrKey = uniqueAttr?.key;
		classData.forEach((entity) => {
			const hasValidForeignKeys = idMap[entity.source] && idMap[entity.target];
			if (!hasValidForeignKeys) {
				return;
			}
			const uniqueValue = uniqueAttrKey
				? `${idMap[entity.source]}-${idMap[entity.target]}-${entity[uniqueAttrKey]}`
				: `${idMap[entity.source]}-${idMap[entity.target]}`;
			const existingEntity = entityByUniqueValue[uniqueValue];
			if (existingEntity) {
				entityByUniqueValue[uniqueValue] = {
					...existingEntity,
					...entity,
					source: idMap[entity.source],
					target: idMap[entity.target],
					_ulid: existingEntity._ulid,
					_ulprov: entityHasUpdated(existingEntity, entity, true)
						? `${existingEntity._ulprov},${entity._ulprov}`
						: existingEntity._ulprov,
				};
			} else {
				entityByUniqueValue[uniqueValue] = {
					...entity,
					source: idMap[entity.source],
					target: idMap[entity.target],
				};
			}
		});
		nextData[classKey] = Object.values(entityByUniqueValue);
	});
	return nextData;
};
