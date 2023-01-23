import prisma from "prisma/db";
import { getServerSupabase } from "utils/server/supabase";

export const generateExportVersionJson = async (
	versionId: string,
	collectionSlugSuffix: string,
	exportSlug: string,
	mapping: { [key: string]: any },
	includeMetadata: boolean = true
) => {
	// generateExportVersionJson(inputDataUrl, mapping)
	// - get input file as json
	// - go through each and create a new object that uses mapping (either includes name or skips value)
	// - cache file

	/* Mapping of form
		{
			Person: {
				include: true,
				rename: '',
				attributes: {
					name: {
						include: true,
						rename: 'fullName',
					}
				}
			}
		}
	*/

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
				if (includeMetadata) {
					const autoIncludeKeys = ["_ulid", "_ulprov"];
					if (autoIncludeKeys.includes(attr)) {
						/* If it's ulid or ulprov */
						nextEntity[attr] = entity[attr];
						return;
					}
				}
				const mappingAttr = mapping[versionDataKey].attributes[attr];
				if (!mappingAttr || !mappingAttr.include) {
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

	const fileUri = `${filePathPrefix}/${version.number}.json`;
	await supabase.storage.from("data").upload(fileUri, JSON.stringify(nextData));

	const { data: listData } = await supabase.storage
		.from("data")
		.list(filePathPrefix, { search: version.number });

	// @ts-ignore
	return { fileUri, size: String(listData[0].metadata.size) };
};
