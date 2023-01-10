import https from "https";
import { parse } from "csv-parse";
import { v4 as uuidv4 } from "uuid";
import { getClassKeyById } from "utils/shared/schema";
import { Schema } from "utils/shared/types";

export const processCsv = async (
	schema: Schema,
	csvUri: string,
	mapping: [],
	inputObjectId: string
) => {
	/* Setup object with Class keys for us to populate on csv iteration */
	const records = schema.reduce((prev: any, curr: { key: string }) => {
		return { ...prev, [curr.key]: [] };
	}, {});
	return new Promise<{}>((resolve) => {
		https.get(csvUri, async (stream) => {
			const parser = stream.pipe(
				parse({
					columns: true,
					trim: true,
				})
			);

			for await (const record of parser) {
				/*
					Each record (i.e. csv row) has at most one of each entity type
					We pre-set the entities we know will be created by reducing
					the mapping and generating stub objects with ids & prov
				*/
				const entities = mapping.reduce((prev: any, curr: { class: string }) => {
					return { ...prev, [curr.class]: { _ulid: uuidv4(), _ulprov: inputObjectId } };
				}, {});
				/*
					We iterate over the mapping again populate the stub entites with the
					values from the record, taking only the fields specified in the mapping
				*/
				mapping.forEach((valueMap: { class: string; attr: string; csvHeader: string }) => {
					entities[valueMap.class][valueMap.attr] = record[valueMap.csvHeader.trim()];
				});

				/* 
					Some rows will have entities that have already been created by previous rows.
					We de-dupe these at the end of the parser, but this is problematic for
					relationship generation. We need to use a single _ulid, so that we don't remove
					nodes that relationships point to during the de-duping. This next .map overwrites _ulids
					for nodes that have been previously created, so that relationships are correctly created. 
				*/
				Object.keys(entities).map((entityKey) => {
					const entity = entities[entityKey];
					const entityClass = schema.find((schemClass) => {
						return schemClass.key === entityKey;
					});
					const uniqueAttr = entityClass?.attributes.find((attr) => {
						return attr.isUID;
					});
					const uniqueAttrKey = uniqueAttr?.key;
					if (uniqueAttrKey) {
						const alreadyExisting = records[entityKey].find((existingEntity: any) => {
							return existingEntity[uniqueAttrKey] === entity[uniqueAttrKey];
						});
						if (alreadyExisting) {
							entities[entityKey]._ulid = alreadyExisting._ulid;
						}
					}
				});

				// Based on the schema, we need to figure out which entities are a relationship that needs to grab a value
				const entityKeys = Object.keys(entities);
				schema
					.filter((schemaClass) => {
						return schemaClass.isRelationship;
					})
					.forEach((schemaClass) => {
						const sourceKey = getClassKeyById(schemaClass.attributes[0].type, schema);
						const targetKey = getClassKeyById(schemaClass.attributes[1].type, schema);

						if (
							sourceKey &&
							targetKey &&
							entityKeys.includes(sourceKey) &&
							entityKeys.includes(targetKey)
						) {
							/* If both types of entities are in the csv row, then we can create a relationship! */
							const sourceId = entities[sourceKey]._ulid;
							const targetId = entities[targetKey]._ulid;
							entities[schemaClass.key] = {
								source: sourceId,
								target: targetId,
							};
						}
					});
				/* Need to filter out relationships that didn't actually exist */
				// We may be able to warn about this on the UI.
				// If a relationship attribtue is selected, but it's source and target
				// types aren't on the mapping, then no relationship will be produced.
				/* TODO: Implementation
					Make sure you clear unconnected relationship nodes that are made.
				*/

				Object.keys(entities).forEach((entityKey: string) => {
					records[entityKey].push(entities[entityKey]);
				});
			}
			/*
				De-dupe records. Duplicate entities can be created if they are
				listed on more than one row, because
				they are related to many nodes. This can be simplified now that
				we know duplicate elements will have a common _ulid. But was rushing
				when implementing for sake of demoing.
			*/
			const uniqueRecords: any = {};
			Object.keys(records).forEach((entityKey: string) => {
				const allElements = records[entityKey];

				const entityClass = schema.find((schemClass) => {
					return schemClass.key === entityKey;
				});
				const uniqueAttr = entityClass?.attributes.find((attr) => {
					return attr.isUID;
				});
				const uniqueAttrKey = uniqueAttr?.key;
				if (!uniqueAttrKey) {
					uniqueRecords[entityKey] = allElements;
				} else {
					const uniques: any = {};
					const uniqueElements = allElements.filter((element: any) => {
						const alreadySeen = uniques[element[uniqueAttrKey]];
						if (alreadySeen) {
							return false;
						} else {
							uniques[element[uniqueAttrKey]] = true;
							return true;
						}
					});
					uniqueRecords[entityKey] = uniqueElements;
				}
			});
			resolve(uniqueRecords);
		});
	});
};
