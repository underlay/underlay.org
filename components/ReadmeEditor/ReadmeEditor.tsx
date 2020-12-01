import React, { useEffect, useRef } from "react";

import { majorScale, Pane } from "evergreen-ui";

import { Text } from "@codemirror/next/text";

import styles from "./ReadmeEditor.module.scss";

export interface ReadmeEditorProps {
	initialValue: string;
	onChange?: (doc: Text) => void;
	readOnly?: boolean;
}

import dynamic from "next/dynamic";

const ReadmeEditor = dynamic(
	async () => {
		const { EditorState, EditorView, basicSetup } = await import(
			"@codemirror/next/basic-setup"
		);
		const { keymap } = await import("@codemirror/next/view");
		const { defaultKeymap, indentMore, indentLess } = await import("@codemirror/next/commands");
		const { linter } = await import("@codemirror/next/lint");

		const baseExtensions = [
			basicSetup,
			keymap([
				...defaultKeymap,
				{
					key: "Tab",
					preventDefault: true,
					run: indentMore,
				},
				{
					key: "Shift-Tab",
					preventDefault: true,
					run: indentLess,
				},
			]),
		];

		return function ReadmeEditor({ initialValue, onChange, readOnly }: ReadmeEditorProps) {
			const div = useRef<HTMLDivElement>(null);

			useEffect(() => {
				if (div.current) {
					const extensions = [...baseExtensions];
					extensions.push(
						linter((view) => {
							if (onChange !== undefined) {
								onChange(view.state.doc);
							}
							return [];
						})
					);

					if (readOnly) {
						extensions.push(EditorView.editable.of(false));
					}

					const state = EditorState.create({ doc: initialValue, extensions });
					new EditorView({ state, parent: div.current });
				}
			}, []);

			return (
				<Pane maxWidth={majorScale(128)}>
					<div className={styles.editor} ref={div}></div>
				</Pane>
			);
		};
	},
	{ ssr: false }
);

export default ReadmeEditor;
