import { supabase } from "utils/client/supabase";
import { parse } from "csv-parse";
import type { Entity, Class, Mapping } from "utils/shared/types";
import { mapData } from "utils/shared/mapping";

export const downloadExport = async (fileUri: string, fileName: string) => {
	const { publicURL, error } = await supabase.storage.from("data").getPublicUrl(fileUri);
	if (error || !publicURL) {
		throw error;
	}

	const link = document.createElement("a");
	link.download = fileName;
	link.href = publicURL;
	link.target = "_blank";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

// export const uploadData = async (file: File, fileName: string, version: string) => {
// 	fileName = fileName.replace(".csv", version + ".csv");
// 	const { publicURL, error: urlError } = supabase.storage.from("data").getPublicUrl(fileName);
// 	if (urlError) {
// 		throw urlError;
// 	}

// 	let { error: uploadError } = await supabase.storage.from("data").upload(fileName, file);
// 	if (uploadError) {
// 		// File already exists. Reupload
// 		if ((uploadError as any).statusCode === "23505") {
// 			let { error: updateError } = await supabase.storage.from("data").update(fileName, file);
// 			if (updateError) {
// 				throw updateError;
// 			}
// 		} else {
// 			throw uploadError;
// 		}
// 	}

// 	return publicURL;
// };

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

	return mapData(text, nodes, relationships, mapping);
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
