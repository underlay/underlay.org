import { Input } from "@prisma/client";
import { Class, Schema } from "utils/shared/types";
import { getServerSupabase } from "./supabase";

export const updateDraftVersion = async (
	inputObject: Input,
	slugSuffix: string,
	schema: Schema
) => {
	/* Merge it with past values */
	/* TODO here! */
	// Load/check current draft.json
	// OutputData has the same shape as version files, and a version file is just a reduction
	// of all outputData blobs up to the point of a version publication.

	// For all entities of a given type, we have to compare the unqiueness attribute
	// (How do you specify whether multiple relationships are possible? i.e. you can't have more than one age, but you can have more than one child)
	// If the uniqueness matches, we want to {...} the two objects (stripping `_ulid` and concatting ulprov)
	// That doesn't seem too tough - just perhaps a bit unperformant for large sets
	// What abotu relationships can change?
	// Perhaps for relationships, the source and target define a uniqueness in the absence of
	// no other unique value.
	// Rel: WasInCity (Travis<>Boston) - I may have many, but unless there is some field
	// specifying how to differentiate (e.g. a date) - it doesn't carry a bunch of info?
	// Eh - I don't know about that... `source-target` does not necessarily imply unique
	// Maybe unique for relationships is different, they aren't enumerated the same way, they
	// have meaning outside of their source/target the way a Node does. When looking at 'unique'
	// fields on a relationship, we only compare within the set of other relationships.
	// If you don't want us to merge things into a single relatiosnhip value, you need to specify
	// at least one field as being unique (it's sorta inverted from uniqueness on nodes -
	// we merge everything unless there is unqiue, rather than only merging if unique matches )

	// and on importing, if you uimport the same file with just one value changes, you don't want
	// to produce duplicate relationships, so you ahve to assume they merge unless there is a
	// new unique field on one of the relationships

	/* 
		If Merge:
		Iterate over jsons in outputData per Class
		For each, iterate over all existing Classes of same,
		Match based on unique fields (or relationship values)
		If no match, it's a new entity, so append
		If matched, take two jsons,
		keep earlier _ulid
		concat _ulprov with commas
		then merge newer over older
		append result
	*/
	/* 
	
	/* But wait, we can do this O(2n) rather than O(n^2)
	Just need to answer how to handle entities that have multiple unique values
	Do they all have to match?Only one? Only don't merge if none?
	Maybe it's the difference between 'Unique' and 'identifier'
	Wait - ya, we're not saying 'unqiue' like in psql where only one value can have it
	We're using it as in 'unique idenitifer' - more like primary key, which there's only one of
	We're conflating @unique with @id. None of this code is about enforcing @unqiue, so really,
	we're just working with @id in these processes.
	And then relationships we're just merging on source+target unless specified, in which case 
	we merge on source+target+@id.
	*/
	// TODO: Refactor
	// Simplify by looking for a single @id value, rather than checking all unique fields
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
	const nextData = {};
	const allClassKeys = getAllClassKeys(oldJson, newJson);

	allClassKeys.forEach((outputDataClassKey) => {
		const newEntities = newJson[outputDataClassKey] || [];
		const previousEntities = oldJson[outputDataClassKey] || [];
		const activeSchemaClass = schema.find((schemaClass) => {
			return schemaClass.key === outputDataClassKey;
		}) as Class;
		const uniqueAttrs = activeSchemaClass.attributes
			.filter((attr) => {
				return attr.isUnique;
			})
			.map((attr) => attr.key);
		const newProcessed = [];
		newEntities.forEach((newEntity) => {
			const newUniques = uniqueAttrs?.map((attr) => {
				return newEntity[attr];
			});

			const matchingPrevious = previousEntities.find((oldEntity, index) => {
				const oldUniques = uniqueAttrs.map((attr) => {
					return oldEntity[attr];
				});
				const uniquesMatch = newUniques.some((val, index) => {
					return val === oldUniques[index];
				});
				const relationshipMatch =
					activeSchemaClass.isRelationship &&
					newEntity.source === oldEntity.source &&
					newEntity.target == oldEntity.target &&
					(!uniqueAttrs.length || uniquesMatch);
				/* 3 cases
				A. No unique attrs, in which case uniquesMatch will equal false
				B. Unique attrs, but they don't match, in which case uniquesMatch equals false
				C. Unique attrs, and they match, uniquesMatch equals true

				And what we do:
				A. merge
				B. Don't merge
				C. Merge
				*/
				// TODO: fix
				// To avoid duplicate relationships, they're initially made to ulid's that
				// get wiped out on merge. So we either need a map of ulid aliases, and to
				// process relationships after all nodes have been. Or, we need to go through and remove
				// relationships that don't have a valid source or target ulid. This would solve the
				// empty relationship value problem as well.

				if (uniquesMatch || relationshipMatch) {
					previousEntities.splice(index, 1);
					return true;
				}
				return false;
			});

			if (!matchingPrevious) {
				newProcessed.push(newEntity);
			} else {
				// TODO: Fix
				// Don't append prov in the value is unchanged...
				newProcessed.push({
					...matchingPrevious,
					...newEntity,
					_ulid: matchingPrevious._ulid,
					_ulprov: `${matchingPrevious._ulprov},${newEntity._ulprov}`,
				});
			}
			// Look up with attributes if the entity are unique, put into array
			// For each existingDataEntity, put unique attributes into array
			// Compare if any of the values match that in newEntityArray
			// If so, that's the existingData object we're looking for!
			// If there's an existing data object, merge
			// {
			// 	...oldEntity,
			// 	...newEntity,
			// 	_ulid: oldEntity._ulid,
			// 	_ulprov: `${oldEntity._ulprov},${newEntity._ulprov}`
			// }
			// Else, just add newEntity
		});
		nextData[outputDataClassKey] = [...previousEntities, ...newProcessed];
	});
	return nextData;
};
