import React from "react";
import { GetServerSideProps } from "next";

import { validationError, ValidationError } from "@underlay/pipeline";

import { PipelinePageFrame, PipelineViewer, ValidationReport, VersionNavigator } from "components";

import {
	prisma,
	selectResourcePageProps,
	serializeUpdatedAt,
	serializeCreatedAt,
	selectExecutionOverviewProps,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	ResourcePageParams,
	getProfileSlug,
	PipelinePageProps,
	ExecutionProps,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

import type { PipelineBlocks, PipelineGraph } from "utils/shared/pipeline";
import { pipelineBlocks, pipelineGraph, emptyGraph } from "utils/server/pipeline";
import { Heading, majorScale, Pane } from "evergreen-ui";

export type ExecutionPageProps = PipelinePageProps & {
	blocks: PipelineBlocks;
	execution: ExecutionProps & { graph: PipelineGraph; error: ValidationError | null };
	previousExecution: { executionNumber: string } | null;
	nextExecution: { executionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<
	ExecutionPageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const executionWithPipeline = await prisma.execution.findFirst({
		where: { id },
		select: {
			...selectExecutionOverviewProps,
			graph: true,
			error: true,
			previousExecution: { select: { executionNumber: true } },
			nextExecution: { select: { executionNumber: true } },
			pipeline: { select: selectResourcePageProps },
		},
	});

	if (executionWithPipeline === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, executionWithPipeline.pipeline, false)) {
		return { notFound: true };
	}

	const {
		pipeline,
		previousExecution,
		nextExecution,
		error: errorValue,
		graph: graphValue,
		...execution
	} = serializeCreatedAt(executionWithPipeline);

	const graph = pipelineGraph.is(graphValue) ? graphValue : emptyGraph;
	const error = validationError.is(errorValue) ? errorValue : null;

	return {
		props: {
			pipeline: serializeUpdatedAt(pipeline),
			execution: { ...execution, error, graph },
			previousExecution,
			nextExecution,
			blocks: pipelineBlocks,
		},
	};
};

const ExecutionPage: React.FC<ExecutionPageProps> = ({
	blocks,
	execution,
	previousExecution,
	nextExecution,
	...props
}) => {
	const profileSlug = getProfileSlug(props.pipeline.agent);
	const contentSlug = props.pipeline.slug;

	const previous = previousExecution?.executionNumber || null;
	const next = nextExecution?.executionNumber || null;

	const errors = execution.error === null ? [] : [execution.error];

	return (
		<LocationContext.Provider
			value={{
				profileSlug,
				contentSlug,
				versionNumber: execution.executionNumber,
				mode: "executions",
			}}
		>
			<PipelinePageFrame {...props}>
				<VersionNavigator previous={previous} next={next} createdAt={execution.createdAt} />
				<PipelineViewer blocks={blocks} graph={execution.graph} />
				{execution.successful === null ? (
					<Pane marginY={majorScale(2)} border background="yellowTint">
						<Heading margin={majorScale(2)}>Pending</Heading>
					</Pane>
				) : execution.successful ? (
					<Pane marginY={majorScale(2)} border background="greenTint">
						<Heading margin={majorScale(2)}>Success</Heading>
					</Pane>
				) : (
					<ValidationReport errors={errors} />
				)}
			</PipelinePageFrame>
		</LocationContext.Provider>
	);
};

export default ExecutionPage;
