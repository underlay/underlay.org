import { supabase } from "utils/client/supabase";
import { parse } from "csv-parse";

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
	mapping: { [key: string]: string },
	version: string
) => {
	fileName = fileName.replace(/.csv$/, version + ".csv");
	console.log(fileName);

	const { data, error } = await supabase.storage.from("data").download(fileName);

	if (error || !data) {
		throw error;
	}
	const text = await data.text();
	console.log(text);

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
			resolve(
				records.map((r) => {
					const recordObj: any = {};
					headerRow.forEach((rowName, i) => {
						recordObj[mapping[rowName]] = r[i];
					});
					return recordObj;
				})
			);
		});

		parser.on("error", (err) => reject(err));

		parser.write(text);

		parser.end();
	});
};

export const getCSVHeaders = async (fileName: string, version: string) => {
	fileName = fileName.replace(/.csv$/, version + ".csv");

	const { data, error } = await supabase.storage.from("data").download(fileName);

	if (error || !data) {
		throw error;
	}
	const text = await data.text();

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