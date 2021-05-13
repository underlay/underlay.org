import React from "react";
import { GetServerSideProps } from "next";

import type { ValidationError } from "@underlay/pipeline";

import { prisma, serializeUpdatedAt, selectResourcePageProps } from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import { ResourcePageParams, getProfileSlug, PipelinePageProps } from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

import { PipelineViewer, PipelinePageFrame, PipelineValidationReport } from "components";
import type { PipelineGraph, PipelineBlocks } from "utils/shared/pipeline";
import {
	pipelineGraph,
	pipelineBlocks,
	emptyGraph,
	validatePipelineGraph,
} from "utils/server/pipeline";

type PipelineOverviewProps = PipelinePageProps & {
	pipeline: { graph: PipelineGraph };
	errors: ValidationError[];
	blocks: PipelineBlocks;
};

export const getServerSideProps: GetServerSideProps<
	PipelineOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const pipelineWithGraph = await prisma.pipeline.findUnique({
		where: { id },
		select: { ...selectResourcePageProps, graph: true },
	});

	// The reason to check for null separately from getResourcePagePermissions
	// is so that TypeScript know it's not null afterward
	if (pipelineWithGraph === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, pipelineWithGraph, false)) {
		return { notFound: true };
	}

	const { graph: graphValue, ...pipeline } = serializeUpdatedAt(pipelineWithGraph);
	const graph = pipelineGraph.is(graphValue) ? graphValue : emptyGraph;

	const errors = await validatePipelineGraph(graph);

	return { props: { pipeline: { ...pipeline, graph }, errors, blocks: pipelineBlocks } };
};

const PipelineOverviewPage: React.FC<PipelineOverviewProps> = ({ blocks, pipeline, errors }) => {
	const profileSlug = getProfileSlug(pipeline.agent);
	const contentSlug = pipeline.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<PipelinePageFrame pipeline={pipeline}>
				<PipelineViewer blocks={blocks} graph={pipeline.graph} />
				<PipelineValidationReport errors={errors} />
			</PipelinePageFrame>
		</LocationContext.Provider>
	);
};

export default PipelineOverviewPage;
