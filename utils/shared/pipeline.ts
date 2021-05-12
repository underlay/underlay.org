import type { EditorState, Kinds, EditorAction, Node, Edge } from "react-dataflow-editor";

import type { Blocks } from "@underlay/pipeline";

export type PipelineSchema = {
	[K in keyof Blocks]: {
		inputs: keyof Blocks[K]["inputs"];
		outputs: keyof Blocks[K]["outputs"];
	};
};

export type PipelineEditorAction = EditorAction<PipelineSchema>;
export type PipelineEditorState = EditorState<PipelineSchema>;

// A Block is a Kind augmented with an initial value
export type PipelineBlocks = Kinds<PipelineSchema> &
	{ [K in keyof Blocks]: { initialValue: Blocks[K]["state"] } };

export type PipelineConfigState = Record<string, Blocks[keyof Blocks]["state"]>;

// PipelineGraph differs from PipelineEditorState in two ways:
// 1. it doesn't store focus state
// 2. it has a `state` object that stores each node's config value
export type PipelineGraph = {
	nodes: Record<string, Node<PipelineSchema>>;
	edges: Record<string, Edge<PipelineSchema>>;
	state: PipelineConfigState;
};

export function reduceState(
	blocks: PipelineBlocks,
	state: PipelineConfigState,
	action: PipelineEditorAction
): PipelineConfigState {
	if (action.type === "node/create") {
		const { initialValue } = blocks[action.kind];
		return { ...state, [action.id]: { ...initialValue } };
	} else if (action.type === "node/delete") {
		const { [action.id]: _, ...rest } = state;
		return rest;
	} else {
		return state;
	}
}
