import React from "react";
import { GetServerSideProps } from "next";

import {
	prisma,
	serializeUpdatedAt,
	selectResourcePageProps,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	ResourcePageParams,
	getProfileSlug,
	PipelinePageProps,
	ExecutionProps,
} from "utils/shared/propTypes";
import { LocationContext, useLocationContext } from "utils/client/hooks";

import { PipelinePageFrame } from "components";
import { Paragraph, Table } from "evergreen-ui";
import { buildUrl } from "utils/shared/urls";

type PipelineExecutionsProps = PipelinePageProps & {
	executions: ExecutionProps[];
};

export const getServerSideProps: GetServerSideProps<
	PipelineExecutionsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const pipelineWithExecutions = await prisma.pipeline.findUnique({
		where: { id },
		select: {
			...selectResourcePageProps,
			executions: {
				select: {
					id: true,
					executionNumber: true,
					user: { select: { id: true, slug: true } },
					successful: true,
					createdAt: true,
				},
			},
		},
	});

	// The reason to check for null separately from getResourcePagePermissions
	// is so that TypeScript know it's not null afterward
	if (pipelineWithExecutions === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, pipelineWithExecutions, true)) {
		return { notFound: true };
	}

	const { executions, ...pipeline } = serializeUpdatedAt(pipelineWithExecutions);

	return {
		props: {
			pipeline,
			executions: executions.map(serializeCreatedAt),
		},
	};
};

const PipelineExecutePage: React.FC<PipelineExecutionsProps> = ({ pipeline, executions }) => {
	const profileSlug = getProfileSlug(pipeline.agent);
	const contentSlug = pipeline.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "executions" }}>
			<PipelinePageFrame pipeline={pipeline}>
				<ExecutionsContent executions={executions} />
			</PipelinePageFrame>
		</LocationContext.Provider>
	);
};

function ExecutionsContent(props: { executions: ExecutionProps[] }) {
	const { profileSlug, contentSlug } = useLocationContext();

	if (props.executions.length === 0) {
		return <Paragraph fontStyle="italic">No executions yet!</Paragraph>;
	}

	return (
		<Table>
			<Table.Head>
				<Table.TextHeaderCell>Execution number</Table.TextHeaderCell>
				<Table.TextHeaderCell>User</Table.TextHeaderCell>
				<Table.TextHeaderCell>Date</Table.TextHeaderCell>
				<Table.TextHeaderCell>Status</Table.TextHeaderCell>
			</Table.Head>
			<Table.Body>
				{props.executions.map(({ executionNumber, createdAt, user, successful }, index) => {
					const createdAtDate = new Date(createdAt);
					const href = buildUrl({
						profileSlug,
						contentSlug,
						versionNumber: executionNumber,
					});
					const status =
						successful === null ? "Pending" : successful ? "Success" : "Failure";
					const background =
						successful === null ? "yellowTint" : successful ? "greenTint" : "redTint";
					return (
						<Table.Row key={index} is="a" href={href} background={background}>
							<Table.TextCell>{executionNumber}</Table.TextCell>
							<Table.TextCell>@{user.slug}</Table.TextCell>
							<Table.TextCell>
								{createdAtDate.toDateString()} at{" "}
								{createdAtDate.toLocaleTimeString()}
							</Table.TextCell>
							<Table.TextCell>{status}</Table.TextCell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
}

export default PipelineExecutePage;
