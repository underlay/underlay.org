import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { ResourceProps } from "utils/shared/propTypes";

interface PipelinePageFrameProps {
	pipeline: ResourceProps;
	children: React.ReactNode;
}

const ownerNavItems = (): NavItem[] => [
	{ title: "Overview" },
	{ mode: "executions", title: "Execution history" },
	{ mode: "edit", title: "Edit" },
	{ mode: "settings", title: "Settings" },
];

const nonOwnerNavItems = (): NavItem[] => [{ title: "Overview" }];

const PipelinePageFrame = ({ pipeline, children }: PipelinePageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === pipeline.agent.user?.id;
	const updatedAt = useMemo(() => new Date(pipeline.updatedAt), [pipeline.updatedAt]);
	const navItems = useMemo(() => (isOwner ? ownerNavItems() : nonOwnerNavItems()), [isOwner]);

	return (
		<StandardFrame
			scopeHeaderProps={{
				type: "pipeline",
				detailsTop: <Text>Last updated on {updatedAt.toLocaleDateString()}</Text>,
				detailsBottom: <Text>{pipeline.description}</Text>,
				isPrivate: !pipeline.isPublic,
			}}
			scopeNavProps={{ navItems }}
			content={children}
		/>
	);
};

export default PipelinePageFrame;
