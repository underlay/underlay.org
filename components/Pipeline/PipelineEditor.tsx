import React, { memo } from "react";

import dynamic from "next/dynamic";

import { EditorProps } from "react-dataflow-editor";

import type { PipelineBlocks, PipelineSchema } from "utils/shared/pipeline";

export type PipelineEditorProps = Omit<EditorProps<PipelineSchema>, "blocks" | "graph"> & {
	nodes: Nodes;
	edges: Edges;
	blocks: PipelineBlocks;
};

export type Nodes = EditorProps<PipelineSchema>["graph"]["nodes"];
export type Edges = EditorProps<PipelineSchema>["graph"]["edges"];

// The awkwardness with splitting nodes and edges out just to re-assemble the graph
// is so that memo can prevent the editor from re-rendering on state changes (very desirable)
export default dynamic(
	async () => {
		const { Editor } = await import("react-dataflow-editor/lib/Editor.js");
		return memo(({ nodes, edges, blocks, ...props }: PipelineEditorProps) => (
			<Editor blocks={blocks} graph={{ nodes, edges }} {...props} />
		));
	},
	{ ssr: false }
);
