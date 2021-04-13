import { useCallback, useMemo } from "react";

import { Pane, Heading, Code, majorScale } from "evergreen-ui";

import type { JsonObject } from "@underlay/pipeline";

import type { PipelineGraph } from "utils/shared/pipeline";

import type { Editor } from "./editor";

import { editors } from "./blocks";

export interface BlockEditorProps {
	id: string;
	graph: PipelineGraph;
	setState: (id: string, state: Partial<JsonObject>) => void;
}

export default function BlockEditor({ graph, id, setState }: BlockEditorProps) {
	const state = useMemo(() => graph.state[id] as JsonObject, [graph.state, id]);
	const editor = useMemo(() => {
		const { kind } = graph.nodes[id];
		return editors[kind] as unknown;
	}, [id]) as Editor<JsonObject>;

	const handleSetState = useCallback((state: Partial<JsonObject>) => setState(id, state), [id]);

	if (state === undefined) {
		return null;
	}

	return (
		<Pane border="default" marginY={majorScale(2)} background="tint1">
			<Pane display="flex" margin={majorScale(2)}>
				<Heading flex={1}>Configuation</Heading>
				<Code size={300}>#{id}</Code>
			</Pane>
			<Pane margin={majorScale(2)}>
				<editor.component
					key={id}
					id={id}
					state={state}
					setState={handleSetState}
				></editor.component>
			</Pane>
		</Pane>
	);
}
