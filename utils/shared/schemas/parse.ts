import toml from "toml";

import { Either } from "fp-ts/Either";
import * as t from "io-ts";

import { TomlSchema } from "./codec";
import { Option } from "fp-ts/lib/Option";

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

export const nullOption: { _tag: "None" } = { _tag: "None" };
export const toOption = <L, R>(result: Either<L, R>): Option<R> =>
	result._tag === "Left" ? nullOption : { _tag: "Some", value: result.right };
