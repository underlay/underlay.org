import { Readable } from "stream";
import fetch from "node-fetch";
import { GetObjectCommand } from "@aws-sdk/client-s3";

import { Instance, Schema } from "@underlay/apg";
import { decode } from "@underlay/apg-format-binary";
import schemaSchema, { toSchema } from "@underlay/apg-schema-schema";

import { S3 } from "utils/server/s3";

interface Handler {
	pattern: RegExp;
	resolve(match: RegExpExecArray): Promise<NodeJS.ReadableStream>;
}

const handlers: Handler[] = [
	{
		pattern: /^https?:\/\//,
		async resolve({ input }) {
			const res = await fetch(input);
			if (res.ok && res.body !== null) {
				return res.body;
			} else {
				throw new Error("Invalid response");
			}
		},
	},
	{
		pattern: /^s3:\/\/([a-z0-9\-\.]+)\/(.+)$/,
		async resolve([_, bucket, key]) {
			const command = new GetObjectCommand({ Bucket: bucket, Key: key });
			const { Body } = await S3.send(command);
			if (Body instanceof Readable) {
				return Body;
			} else {
				throw new Error("Unexpected response from S3");
			}
		},
	},
];

export async function resolveURI(uri: string): Promise<NodeJS.ReadableStream> {
	for (const { pattern, resolve } of handlers) {
		const match = pattern.exec(uri);
		if (match !== null) {
			return resolve(match);
		}
	}

	throw new Error("No URI matching handlers found");
}

export async function resolveInstance<S extends Schema.Schema>(
	instanceURI: string,
	schema: S
): Promise<Instance.Instance<S>> {
	const chunks: Buffer[] = [];
	const stream = await resolveURI(instanceURI);
	for await (const chunk of stream) {
		if (chunk instanceof Buffer) {
			chunks.push(chunk);
		} else {
			chunks.push(Buffer.from(chunk));
		}
	}

	const data = Buffer.concat(chunks);
	const instance = decode<S>(schema, data);
	return instance;
}

export async function resolveSchema(schemaURI: string): Promise<Schema.Schema> {
	const instance = await resolveInstance(schemaURI, schemaSchema);
	const schema = toSchema(instance);
	return schema;
}
