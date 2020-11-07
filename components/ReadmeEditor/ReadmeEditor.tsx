import React, { useCallback } from "react";

import dynamic from "next/dynamic";

import styles from "./ReadmeEditor.module.scss";
import { Pane } from "evergreen-ui";

const CodeMirror = dynamic(
	async () => {
		// @ts-ignore
		await import("codemirror/lib/codemirror.css");
		// @ts-ignore
		await import("codemirror/mode/markdown/markdown.js");
		const { UnControlled } = await import("react-codemirror2");
		return UnControlled;
	},
	{ ssr: false }
);

export interface ReadmeEditorProps {
	initialValue: string;
	onChange?: (value: string) => void;
}

const ReadmeEditor: React.FC<ReadmeEditorProps> = (props) => {
	const handleChange = useCallback(
		({}: {}, {}: {}, value: string) => {
			if (props.onChange !== undefined) {
				props.onChange(value);
			}
		},
		[props.onChange]
	);

	return (
		<Pane className={styles.editor} border="default">
			<CodeMirror
				value={props.initialValue}
				options={{ mode: "markdown", lineNumbers: true }}
				onChange={handleChange}
			/>
		</Pane>
	);
};

export default ReadmeEditor;
