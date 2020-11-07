import React, { useCallback, useMemo } from "react";
import { majorScale, Pane } from "evergreen-ui";
import dynamic from "next/dynamic";

import styles from "./SchemaContent.module.scss";

const CodeMirror = dynamic(
	async () => {
		// @ts-ignore
		await import("codemirror/lib/codemirror.css");
		// @ts-ignore
		await import("codemirror/theme/neat.css");
		// @ts-ignore
		await import("codemirror/mode/toml/toml.js");
		const { UnControlled } = await import("react-codemirror2");
		return UnControlled;
	},
	{ ssr: false }
);

export interface SchemaContentProps {
	initialValue: string;
	readOnly?: boolean;
	onChange?: (value: string) => void;
}

const baseOptions = { mode: "toml", lineNumbers: true, theme: "neat" };

const SchemaContent: React.FC<SchemaContentProps> = ({ initialValue, readOnly, onChange }) => {
	const handleChange = useCallback(
		({}: {}, {}: {}, value: string) => {
			if (onChange !== undefined) {
				onChange(value);
			}
		},
		[onChange]
	);

	const options = useMemo(
		() => (readOnly ? { ...baseOptions, readOnly: "nocursor" } : baseOptions),
		[readOnly]
	);

	return (
		<Pane className={styles.editor} border="default" width={majorScale(64)}>
			<CodeMirror value={initialValue} options={options} onChange={handleChange} />
		</Pane>
	);
};

export default SchemaContent;
