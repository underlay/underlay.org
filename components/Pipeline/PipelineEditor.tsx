import React, { memo } from "react";

import { Node, Edge } from "react-dataflow-editor";

import type { PipelineBlocks, PipelineSchema } from "utils/shared/pipeline";

export interface PipelineEditorProps {
	nodes: Record<string, Node<PipelineSchema>>;
	edges: Record<string, Edge<PipelineSchema>>;
	blocks: PipelineBlocks;
}

const PipelineEditor: React.FC<PipelineEditorProps> = () => {
	return null;
};

export default memo(PipelineEditor);
