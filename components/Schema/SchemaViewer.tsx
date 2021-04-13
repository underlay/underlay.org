import React, { memo, useEffect, useRef } from "react";
import { BoxOwnProps, Pane, PaneOwnProps } from "evergreen-ui";

import dynamic from "next/dynamic";

import styles from "./style.module.scss";

const TaslViewer = dynamic(
	async () => {
		const { EditorState } = await import("@codemirror/next/state");
		const { EditorView } = await import("@codemirror/next/view");
		const { readOnlyConfig } = await import("@underlay/tasl-codemirror");

		return function TaslViewer({ value }: { value: string }) {
			const div = useRef<HTMLDivElement>(null);
			const view = useRef<InstanceType<typeof EditorView> | null>(null);

			useEffect(() => {
				if (div.current) {
					const extensions = [readOnlyConfig];
					const state = EditorState.create({ doc: value, extensions });
					view.current = new EditorView({
						state: state,
						parent: div.current,
					});
				}
			}, []);

			return <div className={styles.editor} ref={div}></div>;
		};
	},
	{ ssr: false }
);

export interface SchemaViewerProps {
	value: string;
}

// These two values have to be kept in sync with style.module.scss
const fontSize = 16;
const lineHeight = 1.4;

function countLines(value: string): number {
	let count = 0;
	for (let index = 0; index !== -1; index = value.indexOf("\n", index + 1)) {
		count++;
	}
	return count;
}

const SchemaViewer: React.FC<SchemaViewerProps & BoxOwnProps<"div", PaneOwnProps>> = memo(
	({ value, ...rest }) => {
		// This is a hack to calculate the initial height of the component
		// so that we can set it manually while the actual editor is dynamically loading.
		const lines = countLines(value);
		const height = 8 + 2 + fontSize * lineHeight * lines;
		const normalizedHeight = Math.round(height * 100) / 100;

		return (
			<Pane
				className={styles.container}
				border="default"
				style={{ height: normalizedHeight }}
				{...rest}
			>
				<TaslViewer value={value} />
			</Pane>
		);
	}
);

export default SchemaViewer;
