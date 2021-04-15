import React from "react";
import { GetServerSideProps } from "next";

import { PipelinePageFrame, Section } from "components";
import { ResourcePageParams, getProfileSlug, ResourceContentProps } from "utils/shared/propTypes";

import { getResourcePagePermissions } from "utils/server/permissions";
import { prisma, selectResourcePageProps, serializeUpdatedAt } from "utils/server/prisma";
import { LocationContext } from "utils/client/hooks";

type PipelineSettingsProps = { pipeline: ResourceContentProps };

export const getServerSideProps: GetServerSideProps<
	PipelineSettingsProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const pipeline = await prisma.pipeline.findFirst({
		where: { id },
		select: selectResourcePageProps,
	});

	if (pipeline === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, pipeline, true)) {
		return { notFound: true };
	}

	return { props: { pipeline: serializeUpdatedAt(pipeline) } };
};

const PipelineSettingsPage: React.FC<PipelineSettingsProps> = (props) => {
	const profileSlug = getProfileSlug(props.pipeline.agent);
	const contentSlug = props.pipeline.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "settings" }}>
			<PipelinePageFrame {...props}>
				<Section title="Settings" />
			</PipelinePageFrame>
		</LocationContext.Provider>
	);
};

export default PipelineSettingsPage;
