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
	// const schema = source.input[0].schema.content as [];
	// const mapping = source.mapping as [];
	// const csvUri = source.fileUri;

	const records = mapping.reduce((prev: any, curr: { class: string }) => {
		return { ...prev, [curr.class]: [] };
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
					the mapping and generating stub objects with ids
				*/
				const entities = mapping.reduce((prev: any, curr: { class: string }) => {
					return { ...prev, [curr.class]: { _ulid: uuidv4(), _ulprov: inputObjectId } };
				}, {});

				/*
					We iterate over the mapping again populate the stub entites with the
					values from the record, taking only the fields specified in the mapping
				*/
				mapping.forEach((valueMap: { class: string; attr: string; csvHeader: string }) => {
					entities[valueMap.class][valueMap.attr] = record[valueMap.csvHeader];
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
						if (entityKeys.includes(sourceKey) && entityKeys.includes(targetKey)) {
							/* If both types of entities are in the csv row, then we can create a relationship! */
							const sourceId = entities[sourceKey]._ulid;
							const targetId = entities[targetKey]._ulid;
							entities[schemaClass.key].source = sourceId;
							entities[schemaClass.key].target = targetId;
						}
					});

				/* Need to filter out relationships that didn't actually exist */
				// We may be able to warn about this on the UI.
				// If a relationship attribtue is selected, but it's source and target
				// types aren't on the mapping, then no relationship will be produced.
				/* TODO: Implementation
					Make sure you clear unconnected relationship nodes that are made.
				*/

				/* 
				On each row, we can 1) generate entities, 2) generate relationships
				We need to:
					- Know which entities to generate
					- Create those
					- Know which entities have a relationship in a row
						- Check which nodes have mappings and have a relationship type that specifies them	
				*/
				entityKeys.forEach((entityKey: string) => {
					records[entityKey].push(entities[entityKey]);
				});
				// records.push(entities);
			}

			resolve(records);
		});
	});
};
