import prisma from "prisma/db";
import { getServerSupabase } from "utils/server/supabase";
import { stringify } from "csv-stringify/sync";
import { Schema } from "@prisma/client";

export const generateExportVersionCsv = async (
	versionId: string,
	schemaId: string,
	collectionSlugSuffix: string,
	exportSlug: string,
	mapping: { [key: string]: any },
	csvMainNode: string
) => {
	/* TODO: Refactor */
	/* Split out mapping logic and supabase writing  */
	/* so that we can unit test the mapping logic */
	const version = await prisma.version.findUnique({
		where: { id: versionId },
	});
	if (!version) {
		return undefined;
	}

	const schema = await prisma.schema.findUnique({
		where: {
			id: schemaId,
		},
	});
	if (!schema) {
		return undefined;
	}

	const filePathPrefix = `${collectionSlugSuffix}/exports/${exportSlug}`;
	const supabase = getServerSupabase();
	const { data, error } = await supabase.storage
		.from("data")
		.download(`${collectionSlugSuffix}/versions/${version.number}.json`);
	const text = (await data?.text()) as string;
	const versionData = error ? {} : JSON.parse(text);

	const nextData: { [key: string]: any } = {};
	Object.keys(versionData).forEach((versionDataKey) => {
		const mappingClass = mapping[versionDataKey];
		if (!mappingClass.include) {
			return;
		}
		const nextEntities: any[] = [];
		versionData[versionDataKey].map((entity: any) => {
			const nextEntity: { [key: string]: any } = {};
			Object.keys(entity).forEach((attr) => {
				const autoIncludeKeys = ["_ulid", "_ulprov"];
				if (autoIncludeKeys.includes(attr)) {
					/* If it's ulid or ulprov */
					nextEntity[attr] = entity[attr];
					return;
				}
				const mappingAttr = mapping[versionDataKey].attributes[attr];
				if (!mappingAttr.include) {
					return;
				}
				const nextEntityAttrKey = mappingAttr.rename || attr;
				nextEntity[nextEntityAttrKey] = entity[attr];
			});
			nextEntities.push(nextEntity);
		});
		const nextDataClassKey = mappingClass.rename || versionDataKey;
		nextData[nextDataClassKey] = nextEntities;
	});

	const csvRecords = convertToCsvRecords(nextData, schema, csvMainNode) as any[];
	const csvOutput = stringify(csvRecords);

	const fileUri = `${filePathPrefix}/${version.number}.csv`;
	await supabase.storage.from("data").upload(fileUri, csvOutput);

	const { data: listData } = await supabase.storage
		.from("data")
		.list(filePathPrefix, { search: version.number });

	// @ts-ignore
	return { fileUri, size: String(listData[0].metadata.size) };
};

/**
 * todo: handle relationships
 */
function convertToCsvRecords(data: any, schema: Schema, csvMainNode: string) {
	const schemaContents = schema.content as any[];

	const mainNodeId = schemaContents.find((c) => c.key === csvMainNode)?.id;

	// const nodes = schemaContents.filter((x) => !x.isRelationship);
	const relationships = schemaContents.filter((x) => x.isRelationship);
	const relevantRelationships = relationships.filter((x) => {
		const source = x.attributes.find((a: any) => a.key === "source");
		const target = x.attributes.find((a: any) => a.key === "target");

		if (source.type === mainNodeId || target.type === mainNodeId) {
			return true;
		}

		return false;
	});

	const result: any[] = [];
	const headerRow: any[] = [];

	for (let eKey in data[csvMainNode][0]) {
		if (!eKey.startsWith("_ul")) {
			headerRow.push(`${csvMainNode}/${eKey}`);
		}
	}

	for (let nodeKey in data) {
		if (nodeKey !== csvMainNode) {
			for (let eKey in data[nodeKey][0]) {
				if (!eKey.startsWith("_ul") && eKey !== "source" && eKey !== "target") {
					headerRow.push(`${nodeKey}/${eKey}`);
				}
			}
		}
	}

	data[csvMainNode].forEach((mainNodeEntity: any) => {
		const row: any[] = [];

		for (let eKey in mainNodeEntity) {
			if (!eKey.startsWith("_ul")) {
				row.push(mainNodeEntity[eKey]);
			}
		}

		for (let rel of relevantRelationships) {
			const relEntity = data[rel.key].find((x: any) => {
				return x.source === mainNodeEntity._ulid || x.target === mainNodeEntity._ulid;
			});

			if (relEntity) {
				const matchNodeType =
					relEntity.source === mainNodeEntity._ulid
						? rel.attributes.find((a: any) => a.key === "target").type
						: rel.attributes.find((a: any) => a.key === "source").type;

				const matchNodeKey = schemaContents.find((x: any) => x.id === matchNodeType)!.key;

				const matchEntity = data[matchNodeKey].find((e: any) => {
					if (relEntity.source === mainNodeEntity._ulid) {
						return e._ulid === relEntity.target;
					} else {
						return e._ulid === relEntity.source;
					}
				});

				if (matchEntity) {
					for (let eKey in matchEntity) {
						if (!eKey.startsWith("_ul")) {
							row.push(matchEntity[eKey]);
						}
					}
				}

				for (let eKey in relEntity) {
					if (eKey !== "source" && eKey !== "target" && !eKey.startsWith("_ul")) {
						row.push(relEntity[eKey]);
					}
				}
			}
		}

		result.push(row);
	});

	result.unshift(headerRow);

	return result;
}
