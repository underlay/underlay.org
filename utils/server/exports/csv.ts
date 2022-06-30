import prisma from "prisma/db";
import { getServerSupabase } from "utils/server/supabase";
import { stringify } from "csv-stringify/sync";

export const generateExportVersionCsv = async (
	versionId: string,
	collectionSlugSuffix: string,
	exportSlug: string,
	mapping: { [key: string]: any }
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

	const csvRecords = convertToCsvRecords(nextData) as any[];
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
function convertToCsvRecords(data: any) {
	const result: any[] = [];

	const headerRow: string[] = [];
	for (let nodeName in data) {
		for (let eKey in data[nodeName][0]) {
			if (eKey.startsWith("_ul")) {
				headerRow.push(eKey);
			} else {
				headerRow.push(`${nodeName}/${eKey}`);
			}
		}

		data[nodeName].map((nodeEntity: any) => {
			const newEntity: any = [];
			for (let eKey in nodeEntity) {
				newEntity.push(nodeEntity[eKey]);
			}

			result.push(newEntity);
		});
	}

	result.unshift(headerRow);

	return result;
}
