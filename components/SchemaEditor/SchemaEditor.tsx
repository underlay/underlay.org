import React from "react";
import { useDebouncedCallback } from "use-debounce";
// import { UnControlled as CodeMirror } from "react-codemirror2";
import toml from "toml";
import * as t from "io-ts";

// import "codemirror/lib/codemirror.css";
// import "codemirror/mode/toml/toml.js";

import dynamic from "next/dynamic";

import { Schema, SchemaVersion } from "@prisma/client";

import { TomlSchema } from "./codec";

import styles from "./SchemaEditor.module.scss";

const CodeMirror = dynamic(
	async () => {
		// @ts-ignore
		import("codemirror/lib/codemirror.css");
		// @ts-ignore
		import("codemirror/mode/toml/toml.js");
		const { UnControlled } = await import("react-codemirror2");
		return UnControlled;
	},
	{ ssr: false }
);

type SchemaEditorProps = {
	schema: Schema;
	schemaVersion: SchemaVersion;
};

async function validate(input: string): Promise<t.TypeOf<typeof TomlSchema>> {
	const doc = toml.parse(input);
	const result = TomlSchema.decode(doc);
	if (result._tag === "Left") {
		throw result.left;
	} else {
		return result.right;
	}
}

const SchemaEditor: React.FC<SchemaEditorProps> = (props: SchemaEditorProps) => {
	const [error, setError] = React.useState<string | null>(null);
	const [value, setValue] = React.useState<string>(props.schemaVersion.content);
	const [schema, setSchema] = React.useState<t.TypeOf<typeof TomlSchema> | null>(null);

	const debounced = useDebouncedCallback(
		(editor: unknown, data: unknown, value: string) =>
			validate(value)
				.then((schema: t.TypeOf<typeof TomlSchema>) => {
					setError(null);
					setSchema(schema);
				})
				.catch((error: Error | t.Errors) => {
					setValue(value);
					setSchema(null);
					if (!Array.isArray(error)) {
						setError(error.toString());
					} else {
						const messages = ["Error parsing schema:", ""];
						for (const { message, context } of error) {
							const key = context
								.map(({ key }) => key)
								.join("/")
								.padStart(1, "/");
							messages.push(message ? `.${key} ${message}` : `.${key}`);
						}
						setError(messages.join("\n"));
					}
				}),
		200
	);

	return (
		<div className={styles.editor}>
			<p>Hello I'm a Schema Editor</p>
			<CodeMirror
				value={props.schemaVersion.content}
				options={{ mode: "toml", lineNumbers: true }}
				onChange={debounced.callback}
			/>
			{error !== null && <pre className={styles.error}>{error}</pre>}
		</div>
	);
};

export default SchemaEditor;
