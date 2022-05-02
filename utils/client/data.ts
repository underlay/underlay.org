import { supabase } from "utils/client/supabase";
import { parse } from "csv-parse";
import type { Entity, Class, Mapping } from "utils/shared/types";

export const uploadData = async (file: File, fileName: string, version: string) => {
	fileName = fileName.replace(".csv", version + ".csv");
	const { publicURL, error: urlError } = supabase.storage.from("data").getPublicUrl(fileName);
	if (urlError) {
		throw urlError;
	}

	let { error: uploadError } = await supabase.storage.from("data").upload(fileName, file);
	if (uploadError) {
		// File already exists. Reupload
		if ((uploadError as any).statusCode === "23505") {
			let { error: updateError } = await supabase.storage.from("data").update(fileName, file);
			if (updateError) {
				throw updateError;
			}
		} else {
			throw uploadError;
		}
	}

	return publicURL;
};

export const downloadData = async (
	fileName: string,
	format: "csv" | "json" = "csv",
	version: string
) => {
	fileName = fileName.replace(/.csv$/, version + ".csv").replace(/.json$/, version + ".json");

	if (format === "json") {
		const { data, error } = await supabase.storage.from("data").download(fileName);
		if (error || !data) {
			throw error;
		}
		const text = await data.text();

		const records = await new Promise((resolve, reject) => {
			parse(text, (err, records, _info) => {
				if (err) reject(err);

				resolve(records);
			});
		});

		const outData = new Blob([JSON.stringify(records)]);
		const url = window.URL.createObjectURL(outData);

		const link = document.createElement("a");
		link.download = fileName.replace(/.csv$/, ".json");
		link.href = url;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else {
		const { publicURL, error } = await supabase.storage.from("data").getPublicUrl(fileName);
		if (error || !publicURL) {
			throw error;
		}

		const link = document.createElement("a");
		link.download = fileName;
		link.href = publicURL;

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
};

export const getData = async (
	fileName: string,
	version: string,
	nodes: Class[] = [],
	relationships: Class[] = [],
	mapping: Mapping
): Promise<{ entities: { [key: string]: Entity[] } }> => {
	fileName = fileName.replace(/.csv$/, version + ".csv");

	const { data, error } = await supabase.storage.from("data").download(fileName);

	if (error || !data) {
		throw error;
	}
	const text = await data.text();

	return new Promise((resolve, reject) => {
		const parser = parse();
		const records: any[] = [];
		let headerRow: string[];
		let isHeaderRow = true;

		parser.on("readable", () => {
			let record;
			while ((record = parser.read()) !== null) {
				if (isHeaderRow) {
					headerRow = record;

					isHeaderRow = false;
				} else {
					records.push(record);
				}
			}
		});

		parser.on("end", () => {
			const entities: { [nodeId: string]: any[] } = {};

			nodes.forEach((n) => {
				entities[n.key] = [];
			});
			relationships.map((r) => {
				entities[r.key] = [];
			});

			const nodeMappings = nodes.map((n) => {
				const attrIndexMapping: [string, number][] = n.attributes.map((a) => {
					const matchMapping = mapping.find((m) => m.class === n.key && m.attr === a.key);

					const attrIndex = headerRow.findIndex(
						(colName) => colName === matchMapping?.csvHeader
					);
					return [a.key, attrIndex];
				});

				return {
					name: n.key,
					attrIndexMapping,
				};
			});

			const relationshipMappings: {
				name: string;
				source: string;
				target: string;
				attrIndexMapping: [string, number][];
			}[] = [];
			relationships.map((r) => {
				const sourceAttr = r.attributes.find((a) => a.key === "source");
				const targetAttr = r.attributes.find((a) => a.key === "target");

				if (!sourceAttr || !targetAttr) {
					return;
				}

				const otherAttrs = r.attributes.filter(
					(a) => a.key !== "source" && a.key !== "target"
				);
				const attrIndexMapping: [string, number][] = otherAttrs.map((a) => {
					const matchMapping = mapping.find((m) => m.class === r.key && m.attr === a.key);
					const attrIndex = headerRow.findIndex(
						(colName) => colName === matchMapping?.csvHeader
					);
					return [a.key, attrIndex];
				});

				const sourceNode = nodes.find((n) => n.id === sourceAttr.type);
				const targetNode = nodes.find((n) => n.id === targetAttr.type);

				relationshipMappings.push({
					name: r.key,
					source: sourceNode!.key,
					target: targetNode!.key,
					attrIndexMapping,
				});
			});

			records.map((r, ri) => {
				const nameToNewNodeMapping: { [key: string]: any } = {};

				nodeMappings.forEach(({ name, attrIndexMapping }) => {
					const nodeEntity: any = {
						id: `${name}${ri}`,
					};
					attrIndexMapping.forEach(([a, ai]) => {
						nodeEntity[a] = r[ai];
					});

					// TODO: Use unique keys to determine uniqueness later
					if (entities[name].findIndex((n) => n.name === nodeEntity.name) === -1) {
						entities[name].push(nodeEntity);
					}
					nameToNewNodeMapping[name] = nodeEntity;
				});

				relationshipMappings.forEach(({ name, source, target, attrIndexMapping }) => {
					const relationshipEntity: any = {
						id: `${name}${ri}`,
						source: nameToNewNodeMapping[source].name,
						target: nameToNewNodeMapping[target].name,
					};
					attrIndexMapping.forEach(([a, ai]) => {
						relationshipEntity[a] = r[ai];
					});

					entities[name].push(relationshipEntity);
				});
			});

			resolve({
				entities,
			});
		});

		parser.on("error", (err) => reject(err));

		parser.write(text);

		parser.end();
	});
};

export const getCSVHeadersFromSupabase = async (
	fileName: string,
	version: string
): Promise<string[]> => {
	fileName = fileName.replace(/.csv$/, version + ".csv");

	const { data, error } = await supabase.storage.from("data").download(fileName);

	if (error || !data) {
		throw error;
	}
	const text = await data.text();

	return getCSVHeaders(text);
};

export const getCSVHeaders = async (text: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		const parser = parse();
		parser.on("readable", function () {
			let headers = parser.read();
			if (headers !== null) {
				resolve(headers);
			}
		});

		parser.on("error", (err) => reject(err));

		parser.write(text);

		parser.end();
	});
};
