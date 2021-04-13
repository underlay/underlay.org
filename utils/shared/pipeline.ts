import type {
	Graph as EditorGraph,
	Blocks as EditorBlocks,
	EditorAction,
} from "react-dataflow-editor";

import type { Blocks } from "@underlay/pipeline";

export type PipelineSchema = {
	[k in keyof Blocks]: {
		inputs: keyof Blocks[k]["inputs"];
		outputs: keyof Blocks[k]["outputs"];
	};
};

export type PipelineAction = EditorAction<PipelineSchema>;
export type PipelineBlocks = EditorBlocks<PipelineSchema> &
	{ [k in keyof Blocks]: { initialValue: Blocks[k]["state"] } };

export type PipelineState = Record<string, Blocks[keyof Blocks]["state"]>;
export type PipelineGraph = EditorGraph<PipelineSchema> & { state: PipelineState };

export function reduceState(
	state: PipelineState,
	action: PipelineAction,
	blocks: PipelineBlocks
): PipelineState {
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

export const emptyGraph: PipelineGraph = { nodes: {}, edges: {}, state: {} };
