import React, { useCallback, useState } from "react";

import { Focus, FocusAction, Viewer } from "react-dataflow-editor";

import type { PipelineBlocks, PipelineGraph, PipelineSchema } from "utils/shared/pipeline";

export interface PipelineViewerProps {
	blocks: PipelineBlocks;
	graph: PipelineGraph;
}

const PipelineViewer: React.FC<PipelineViewerProps> = (props) => {
	const [focus, setFocus] = useState<Focus | null>(null);

	const dispatch = useCallback((action: FocusAction) => setFocus(action.subject), []);

	return (
		<Viewer<PipelineSchema>
			kinds={props.blocks}
			state={{ nodes: props.graph.nodes, edges: props.graph.edges, focus }}
			dispatch={dispatch}
		/>
	);
};

export default PipelineViewer;
