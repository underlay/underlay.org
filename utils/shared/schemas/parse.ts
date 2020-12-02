import { Either } from "fp-ts/Either";

import { APG } from "@underlay/apg";
import { parse, ParseResult } from "@underlay/tasl-lezer";

export function parseSchema(
	input: string
): Either<string, { schema: APG.Schema; namespaces: Record<string, string> }> {
	let result: ParseResult;
	try {
		result = parse(input);
	} catch (e) {
		return { _tag: "Left", left: e.toString() };
	}
	return { _tag: "Right", right: result };
}
