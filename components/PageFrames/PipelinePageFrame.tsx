import React, { useMemo } from "react";
import { majorScale, Pane, Paragraph } from "evergreen-ui";

import { ScopeHeader, ScopeNav } from "components";
import type { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { ResourceContentProps } from "utils/shared/propTypes";

interface PipelinePageFrameProps {
	pipeline: ResourceContentProps;
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
		<Pane>
			<ScopeHeader type="pipeline" isPublic={pipeline.isPublic}>
				<Pane marginY={majorScale(1)}>
					<Paragraph size={500}>Last updated {updatedAt.toDateString()}</Paragraph>
					<Paragraph size={500}>{pipeline.description}</Paragraph>
				</Pane>
			</ScopeHeader>
			<ScopeNav navItems={navItems} />
			{children}
		</Pane>
	);
};

export default PipelinePageFrame;
