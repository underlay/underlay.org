import React from "react";
import useDebouncedCallback, { Options } from "use-debounce/lib/useDebouncedCallback";

import { Option } from "fp-ts/Option";
import * as t from "io-ts";

import dynamic from "next/dynamic";

import { TomlSchema } from "utils/shared/schemas/codec";
import { parseToml } from "utils/shared/schemas/parse";

import styles from "./SchemaEditor.module.scss";
import { Alert, majorScale, Pane } from "evergreen-ui";

const CodeMirror = dynamic(
	async () => {
		// @ts-ignore
		await import("codemirror/lib/codemirror.css");
		// @ts-ignore
		await import("codemirror/mode/toml/toml.js");
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
	const [error, setError] = React.useState<{ key?: string; message?: string } | null>(null);

	const { callback } = useDebouncedCallback(
		({}: {}, {}: {}, value: string) => {
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
		<Pane width={600}>
			<Pane className={styles.editor} margin={majorScale(1)} border="default">
				<CodeMirror
					value={props.initialValue}
					options={{ mode: "toml", lineNumbers: true }}
					onChange={callback}
				/>
			</Pane>
			{error !== null && (
				<Alert
					intent="warning"
					title={error.key ? `Error in schema at ${error.key}` : "Error parsing schema"}
					margin={majorScale(1)}
				>
					{error.message || null}
				</Alert>
			)}
		</Pane>
	);
}
