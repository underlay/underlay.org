import { parse } from "csv-parse";
import type { Entity, Class, Mapping } from "utils/shared/types";

/**
 * Given a CSV input, schema and mapping, return the mapped data objects
 */
export const mapData = async (
	text: string,
	nodes: Class[] = [],
	relationships: Class[] = [],
	mapping: Mapping
): Promise<{ entities: { [key: string]: Entity[] } }> => {
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

					entities[name].push(nodeEntity);
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
