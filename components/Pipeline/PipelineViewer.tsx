import React, { memo } from "react";

import dynamic from "next/dynamic";

import type { PipelineBlocks, PipelineGraph } from "utils/shared/pipeline";

export interface PipelineViewerProps {
	graph: PipelineGraph;
	blocks: PipelineBlocks;
	onFocus?: (id: string | null) => void;
}

export default dynamic(
	async () => {
		const { Viewer } = await import("react-dataflow-editor/lib/Viewer.js");
		return memo(({ blocks, ...props }: PipelineViewerProps) => (
			<Viewer blocks={blocks} {...props} />
		));
	},
	{ ssr: false }
);
