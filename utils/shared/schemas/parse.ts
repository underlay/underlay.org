import toml from "toml";

import { Either } from "fp-ts/Either";
import * as t from "io-ts";

import { TomlSchema } from "./codec";

const getContextKey = (context: t.Context): string =>
	context
		.flatMap(({ key }) => (isNaN(parseInt(key)) ? [key] : []))
		.join("/")
		.padStart(1, "/");

export function parseToml(
	input: string
): Either<{ key?: string; message?: string }, t.TypeOf<typeof TomlSchema>> {
	let doc: string;
	try {
		doc = toml.parse(input);
	} catch (error) {
		return { _tag: "Left", left: { message: error.toString() } };
	}

	const result = TomlSchema.decode(doc);
	if (result._tag === "Left") {
		if (result.left.length > 0) {
			const { context, message } = result.left.pop()!;
			return { _tag: "Left", left: { key: getContextKey(context), message } };
		} else {
			return { _tag: "Left", left: {} };
		}
	} else {
		return result;
	}
}
