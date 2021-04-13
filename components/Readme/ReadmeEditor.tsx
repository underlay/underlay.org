import React, { useEffect, useRef } from "react";

import styles from "./ReadmeEditor.module.scss";

export interface ReadmeEditorProps {
	initialValue: string;
	onChange?: (value: string) => void;
}

import dynamic from "next/dynamic";

const ReadmeEditor = dynamic(
	async () => {
		const [
			{ keymap },
			{ basicSetup },
			{ defaultKeymap, indentMore, indentLess },
			{ markdown },
			{ useCodeMirror },
		] = await Promise.all([
			import("@codemirror/next/view"),
			import("@codemirror/next/basic-setup"),
			import("@codemirror/next/commands"),
			import("@codemirror/next/lang-markdown"),
			import("utils/client/codemirror"),
		]);

		const extensions = [
			basicSetup,
			markdown(),
			keymap.of([
				...defaultKeymap,
				{ key: "Tab", preventDefault: true, run: indentMore },
				{ key: "Shift-Tab", preventDefault: true, run: indentLess },
			]),
		];

		return function ReadmeEditor({ initialValue, onChange }: ReadmeEditorProps) {
			const [state, _, element] = useCodeMirror<HTMLDivElement>({
				doc: initialValue,
				extensions,
			});

			const valueRef = useRef<string>(initialValue);

			useEffect(() => {
				if (onChange !== undefined && state !== null) {
					const value = state.doc.toString();
					if (value !== valueRef.current) {
						valueRef.current = value;
						onChange(value);
					}
				}
			}, [state]);

			return <div className={styles.editor} ref={element}></div>;
		};
	},
	{ ssr: false }
);

export default ReadmeEditor;

// const extensions = [
// 	basicSetup,
// 	markdown(),
// 	keymap.of([
// 		...defaultKeymap,
// 		{ key: "Tab", preventDefault: true, run: indentMore },
// 		{ key: "Shift-Tab", preventDefault: true, run: indentLess },
// 	]),
// ];

// export default function ReadmeEditor(props: ReadmeEditorProps) {
// 	const [state, _, element] = useCodeMirror<HTMLDivElement>({
// 		doc: props.initialValue,
// 		extensions,
// 	});

// 	const valueRef = useRef<string>(props.initialValue);

// 	useEffect(() => {
// 		if (props.onChange !== undefined && state !== null) {
// 			const value = state.doc.toString();
// 			if (value !== valueRef.current) {
// 				valueRef.current = value;
// 				props.onChange(value);
// 			}
// 		}
// 	}, [state]);

// 	return (
// 		<Pane maxWidth={majorScale(128)}>
// 			<div className={styles.editor} ref={element}></div>
// 		</Pane>
// 	);
// }
