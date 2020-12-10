import React, { memo, useEffect, useRef } from "react";
import { BoxOwnProps, Pane, PaneOwnProps } from "evergreen-ui";

import dynamic from "next/dynamic";

// Only import types here! Otherwise tree shaking breaks.
import { UpdateProps } from "@underlay/tasl-codemirror";

import styles from "./style.module.scss";

const TaslEditor = dynamic(
	async () => {
		const {
			editableConfig,
			makeSchemaLinter,
			EditorView,
			EditorState,
			openLintPanel,
		} = await import("@underlay/tasl-codemirror");

		interface TaslEditorProps {
			initialValue: string;
			onChange: (props: UpdateProps) => void;
		}

		return function TaslEditor({ initialValue, onChange }: TaslEditorProps) {
			const div = useRef<HTMLDivElement>(null);
			const view = useRef<InstanceType<typeof EditorView> | null>(null);

			useEffect(() => {
				if (div.current) {
					const extensions = [editableConfig, makeSchemaLinter(onChange)];
					const state = EditorState.create({ doc: initialValue, extensions });
					view.current = new EditorView({
						state: state,
						parent: div.current,
					});

					openLintPanel(view.current);
					view.current.focus();
				}
			}, []);

			return <div className={styles.editor} ref={div}></div>;
		};
	},
	{ ssr: false }
);

export interface SchemaEditorProps {
	initialValue: string;
	onChange: (props: UpdateProps) => void;
}

const SchemaEditor: React.FC<SchemaEditorProps & BoxOwnProps<"div", PaneOwnProps>> = memo(
	({ initialValue, onChange, ...rest }) => {
		return (
			<Pane className={styles.container} border="default" {...rest}>
				<TaslEditor initialValue={initialValue} onChange={onChange} />
			</Pane>
		);
	}
);

export default SchemaEditor;
