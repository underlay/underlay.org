import { Either, left, right } from "fp-ts/lib/Either.js";

import { Schema } from "@underlay/apg";
import { parse, ParseResult } from "@underlay/tasl-lezer";

export function parseSchema(
	input: string
): Either<string, { schema: Schema.Schema; namespaces: Record<string, string> }> {
	let result: ParseResult;
	try {
		result = parse(input);
	} catch (e) {
		return left(e.toString());
	}
	return right(result);
}
