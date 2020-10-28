import toml from "toml";

import { Either } from "fp-ts/Either";
import * as t from "io-ts";

import { TomlSchema } from "./codec";

export function parseToml(input: string): Either<string, t.TypeOf<typeof TomlSchema>> {
	let doc: string;
	try {
		doc = toml.parse(input);
	} catch (error) {
		return { _tag: "Left", left: error.toString() };
	}

	const result = TomlSchema.decode(doc);
	if (result._tag === "Left") {
		const messages = ["Error parsing schema:", ""];
		for (const { message, context } of result.left) {
			const key = context
				.map(({ key }) => key)
				.join("/")
				.padStart(1, "/");
			messages.push(message ? `.${key} ${message}` : `.${key}`);
		}
		return { _tag: "Left", left: messages.join("\n") };
	} else {
		return result;
	}
}
