import React from "react";
import { GetServerSideProps } from "next";

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
import { PipelinePageFrame, VersionNavigator } from "components";

export type ExecutionPageProps = PipelinePageProps & {
	execution: ExecutionProps;
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

	// We need to take the .collection property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const { pipeline, previousExecution, nextExecution, ...execution } = executionWithPipeline;

	return {
		props: {
			pipeline: serializeUpdatedAt(pipeline),
			execution: serializeCreatedAt(execution),
			previousExecution,
			nextExecution,
		},
	};
};

const ExecutionPage: React.FC<ExecutionPageProps> = ({
	execution,
	previousExecution,
	nextExecution,
	...props
}) => {
	const profileSlug = getProfileSlug(props.pipeline.agent);
	const contentSlug = props.pipeline.slug;

	const previous = previousExecution?.executionNumber || null;
	const next = nextExecution?.executionNumber || null;
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
			</PipelinePageFrame>
		</LocationContext.Provider>
	);
};

export default ExecutionPage;
