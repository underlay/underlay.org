import { Option, some, none, isSome } from "fp-ts/lib/Option.js";
import { isLeft } from "fp-ts/lib/Either.js";
import * as t from "io-ts";

import {
	blocks,
	isBlockKind,
	BaseGraph,
	validateGraphTopology,
	ValidationError,
	isGraph,
	validate,
	makeGraphError,
} from "@underlay/pipeline";

import type { PipelineGraph, PipelineBlocks } from "utils/shared/pipeline";

const defaultBackgroundColor = "lightgray";

export const pipelineBlocks = Object.fromEntries(
	Object.entries(blocks).map(([kind, block]) => {
		const { name, initialValue } = block;
		const backgroundColor = block.backgroundColor || defaultBackgroundColor;
		const inputs = Object.fromEntries(Object.keys(block.inputs).map((input) => [input, null]));
		const outputs = Object.fromEntries(
			Object.keys(block.outputs).map((output) => [output, null])
		);
		return [kind, { name, backgroundColor, inputs, outputs, initialValue }];
	})
) as PipelineBlocks;

export async function validatePipelineGraph(graph: PipelineGraph): Promise<ValidationError[]> {
	const option = encodePipelineGraph(graph);

	if (isSome(option) && isGraph(option.value)) {
		return validate(option.value)
			.then((result) => (isLeft(result) ? result.left : []))
			.catch((err) => {
				console.error(err);
				return [makeGraphError("Internal error - could not validate graph")];
			});
	} else {
		return [makeGraphError("Invalid graph - make sure all the inputs are filled!")];
	}
}

// PipelineGraph is the JSON value that we store in the databse to represent pipelines.
// Even though PipelineGraph is essentially defined by react-dataflow-editor
// (it's just EditorGraph parametrized with PipelineSchema, plus PipelineState),
// react-dataflow-editor doesn't deal with runtime validation at all so we have
// to write a codec for PipelineGraph here. @underlay/pipeline exports a runtime
// validator for its pipeline graphs but unfortunately we can't reuse that because
// of some essential differences between the types - @underlay/pipeline expects
// state to be inlined inside of each node's .state property, while react-dataflow-editor
// doesn't deal with state at all. Plus, react-dataflow-editor expects .position
// properties for each node, which @underlay/pipeline doesn't know or care about.
// And on top of that, @underlay/pipeline requires all inputs to be present, while
// they can be string | null in the dataflow editor.

// The gist is that we actually have to interface between two similar but different
// pipeline graph formats, and @underlay/pipeline has a runtime validator for one
// of them, but we have to write a separate runtime validator for the other one here.
// However we *can* make use of the validateGraphTopology() utility method from
// @underlay/pipeline, which is deliberately written to be general to both formats.

const pipelineNode = t.type({
	id: t.string,
	kind: t.string,
	position: t.type({ x: t.number, y: t.number }),
	inputs: t.record(t.string, t.union([t.null, t.string])),
	outputs: t.record(t.string, t.array(t.string)),
});

const pipelineEdge = t.type({
	id: t.string,
	source: t.type({ id: t.string, output: t.string }),
	target: t.type({ id: t.string, input: t.string }),
});

const basePipelineGraph = t.type({
	nodes: t.record(t.string, pipelineNode),
	edges: t.record(t.string, pipelineEdge),
	state: t.record(t.string, t.unknown),
});

function isPipelineGraph(graph: t.TypeOf<typeof basePipelineGraph>): graph is PipelineGraph {
	// This checks for valid graph structure, ie just that
	// edges connect outputs to inputs and all the ids exist
	if (!validateGraphTopology(graph)) {
		return false;
	}

	// This checks that the node kinds/inputs/outputs are valid,
	// and that the states validate the appropriate state codec.
	for (const [nodeId, node] of Object.entries(graph.nodes)) {
		if (!isBlockKind(node.kind)) {
			return false;
		} else if (node.id !== nodeId) {
			return false;
		}

		const block = blocks[node.kind];

		if (!block.state.is(graph.state[nodeId])) {
			return false;
		}

		for (const input of Object.keys(block.inputs)) {
			if (input in node.inputs) {
				continue;
			} else {
				return false;
			}
		}

		for (const output of Object.keys(block.outputs)) {
			if (output in node.outputs) {
				continue;
			} else {
				return false;
			}
		}
	}

	return true;
}

// Now we can write a single codec that does all the validation in one place!
export const pipelineGraph = new t.Type<PipelineGraph>(
	"PipelineGraph",
	(u): u is PipelineGraph => basePipelineGraph.is(u) && isPipelineGraph(u),
	(i, context) => {
		const result = basePipelineGraph.validate(i, context);
		if (isLeft(result)) {
			return result;
		} else if (isPipelineGraph(result.right)) {
			return t.success(result.right);
		} else {
			return t.failure(i, context);
		}
	},
	t.identity
);

export function encodePipelineGraph({ nodes, edges, state }: PipelineGraph): Option<BaseGraph> {
	const graph: BaseGraph = { nodes: {}, edges: {} };
	for (const [id, { kind, inputs, outputs }] of Object.entries(nodes)) {
		if (validateNodeInputs(inputs) && id in state) {
			graph.nodes[id] = { kind, inputs, outputs, state: state[id] };
		} else {
			return none;
		}
	}
	for (const [id, { source, target }] of Object.entries(edges)) {
		graph.edges[id] = { source, target };
	}
	return some(graph);
}

function validateNodeInputs(
	inputs: Record<string, string | null>
): inputs is Record<string, string> {
	for (const value of Object.values(inputs)) {
		if (value === null) {
			return false;
		}
	}
	return true;
}

export const emptyGraph: PipelineGraph = { nodes: {}, edges: {}, state: {} };
