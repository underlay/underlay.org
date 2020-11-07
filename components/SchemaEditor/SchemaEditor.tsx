import React, { useMemo, useState } from "react";
import useDebouncedCallback, { Options } from "use-debounce/lib/useDebouncedCallback";

import { Option } from "fp-ts/Option";
import * as t from "io-ts";

import { TomlSchema } from "utils/shared/schemas/codec";
import { nullOption, parseToml, toOption } from "utils/shared/schemas/parse";

import { Alert, majorScale, Pane } from "evergreen-ui";
import { SchemaGraph } from "components";
import SchemaContent from "components/SchemaContent/SchemaContent";

export type ResultType = Option<t.TypeOf<typeof TomlSchema>>;

export interface SchemaEditorProps {
	initialValue: string;
	onChange?: (value: string, result: ResultType) => void;
	debounce?: number;
	debounceOptions?: Options;
}

const defaultDebounce = 200;

export default function SchemaEditor(props: SchemaEditorProps) {
	const initialResult = useMemo(() => parseToml(props.initialValue), [props.initialValue]);
	const [error, setError] = useState<{ key?: string; message?: string } | null>(
		initialResult._tag === "Left" ? initialResult.left : null
	);
	const [result, setResult] = useState<ResultType>(toOption(initialResult));

	const { callback } = useDebouncedCallback(
		(value: string) => {
			const result = parseToml(value);
			if (result._tag === "Left") {
				setError(result.left);
				setResult(nullOption);
				if (props.onChange !== undefined) {
					props.onChange(value, nullOption);
				}
			} else {
				const some: ResultType = { _tag: "Some", value: result.right };
				setError(null);
				setResult(some);
				if (props.onChange !== undefined) {
					props.onChange(value, some);
				}
			}
		},
		props.debounce === undefined ? defaultDebounce : props.debounce,
		props.debounceOptions || {}
	);

	return (
		<Pane display="flex" flexWrap="wrap">
			<SchemaContent initialValue={props.initialValue} onChange={callback} />
			<Pane width={majorScale(60)}>
				{error !== null ? (
					<Alert
						intent="warning"
						title={
							error.key ? `Error in schema at ${error.key}` : "Error parsing schema"
						}
					>
						{error.message || null}
					</Alert>
				) : result._tag === "Some" ? (
					<SchemaGraph schema={result.value} />
				) : null}
			</Pane>
		</Pane>
	);
}

export const initialSchemaContent = `# Welcome to the schema editor!
# If you're new, you probably want to read
# the schema language documentation here:
# http://r1.underlay.org/docs/schemas

# If you want to just get started right away,
# here's a generic template to work with:

namespace = "http://example.com/"

[classes.Person]

[classes.Person.name]
kind = "literal"
datatype = "string"
cardinality = "required"

[classes.Person.friends]
kind = "reference"
label = "Person"
cardinality = "any"

[classes.Person.favoriteBook]
kind = "reference"
label = "Book"
cardinality = "optional"

[classes.Book]

[classes.Book.title]
kind = "literal"
datatype = "string"
cardinality = "required"

[classes.Book.isbn]
kind = "uri"
cardinality = "required"
`;
