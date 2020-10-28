import React from "react";
import useDebouncedCallback, { Options } from "use-debounce/lib/useDebouncedCallback";

import { Option } from "fp-ts/Option";
import * as t from "io-ts";

import dynamic from "next/dynamic";

import { TomlSchema } from "utils/shared/schemas/codec";
import { parseToml } from "utils/shared/schemas/parse";

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

export interface SchemaEditorProps {
	initialValue: string;
	onChange?: (value: string, result: Option<t.TypeOf<typeof TomlSchema>>) => void;
	debounce?: number;
	debounceOptions?: Options;
}

const defaultDebounce = 200;

export default function SchemaEditor(props: SchemaEditorProps) {
	const [error, setError] = React.useState<string | null>(null);

	const { callback } = useDebouncedCallback(
		(editor: unknown, data: unknown, value: string) => {
			const result = parseToml(value);
			if (result._tag === "Left") {
				setError(result.left);
				if (props.onChange !== undefined) {
					props.onChange(value, { _tag: "None" });
				}
			} else {
				setError(null);
				if (props.onChange !== undefined) {
					props.onChange(value, { _tag: "Some", value: result.right });
				}
			}
		},
		props.debounce === undefined ? defaultDebounce : props.debounce,
		props.debounceOptions || {}
	);

	return (
		<div className={styles.editor}>
			<CodeMirror
				value={props.initialValue}
				options={{ mode: "toml", lineNumbers: true }}
				onChange={callback}
			/>
			{error !== null && <pre className={styles.error}>{error}</pre>}
		</div>
	);
}
