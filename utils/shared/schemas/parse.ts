import toml from "toml";

import { Either } from "fp-ts/Either";
import * as t from "io-ts";

import { TomlSchema } from "./codec";

function errorToString({ message, context }: t.ValidationError): string {
	const key = context
		.map(({ key }) => key)
		.join("/")
		.padStart(1, "/")
		.slice(1);
	return message ? `Error at ${key} ${message}` : `Error at ${key}`;
}

const defaultErrorMessage = "Invalid schema";

export function parseToml(input: string): Either<string, t.TypeOf<typeof TomlSchema>> {
	let doc: string;
	try {
		doc = toml.parse(input);
	} catch (error) {
		return { _tag: "Left", left: error.toString() };
	}

	const result = TomlSchema.decode(doc);
	if (result._tag === "Left") {
		const error =
			result.left.length > 0 ? errorToString(result.left.pop()!) : defaultErrorMessage;
		return { _tag: "Left", left: error };
	} else {
		return result;
	}
}
