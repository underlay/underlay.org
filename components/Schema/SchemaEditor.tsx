import React, { useEffect, useRef } from "react";

import { Schema } from "@underlay/apg";

import dynamic from "next/dynamic";

import styles from "./style.module.scss";

export interface SchemaEditorProps {
	initialValue: string;
	onChange: (value: string, schema: Schema.Schema, errorCount: number) => void;
}

const SchemaEditor = dynamic(
	async () => {
		const { editableConfig, SchemaState } = await import("@underlay/tasl-codemirror");
		const { useCodeMirror } = await import("utils/client/codemirror");
		const { openLintPanel } = await import("@codemirror/next/lint");

		return function SchemaEditor({ initialValue, onChange }: SchemaEditorProps) {
			const [state, view, div] = useCodeMirror<HTMLDivElement>({
				doc: initialValue,
				extensions: editableConfig,
			});

			const valueRef = useRef<string>(initialValue);
			const schemaRef = useRef<Schema.Schema>({});

			useEffect(() => {
				if (view.current !== null) {
					openLintPanel(view.current);
					view.current.focus();
				}
			}, []);

			useEffect(() => {
				if (onChange !== undefined && state !== null) {
					const value = state.doc.toString();
					const { schema, errorCount } = state.field(SchemaState);
					if (value !== valueRef.current || schema !== schemaRef.current) {
						valueRef.current = value;
						schemaRef.current = schema;
						onChange(value, schema, errorCount);
					}
				}
			}, [state]);

			return <div className={styles.editor} ref={div}></div>;
		};
	},
	{ ssr: false }
);

export default SchemaEditor;
