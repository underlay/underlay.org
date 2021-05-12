import React, { useMemo } from "react";

import { ScopeHeader } from "components";
import ScopeNav, { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { SchemaPageProps } from "utils/shared/propTypes";
import { majorScale, Pane, Paragraph } from "evergreen-ui";

type SchemaPageFrameProps = SchemaPageProps & { children: React.ReactNode };

const ownerNavItems = (versionCount: number): NavItem[] => [
	{ title: "Overview" },
	{ mode: "edit", title: "Edit" },
	{ mode: "versions", title: `Versions (${versionCount})` },
	{ mode: "settings", title: "Settings" },
];

const nonOwnerNavItems = (versionCount: number): NavItem[] => [
	{ title: "Overview" },
	{ mode: "versions", title: `Versions (${versionCount})` },
];

const SchemaPageFrame = ({ schema, versionCount, children }: SchemaPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === schema.agent.user?.id;
	const updatedAt = useMemo(() => new Date(schema.updatedAt), [schema.updatedAt]);
	const navItems = useMemo<NavItem[]>(
		() => (isOwner ? ownerNavItems(versionCount) : nonOwnerNavItems(versionCount)),
		[isOwner, versionCount]
	);

	return (
		<Pane>
			<ScopeHeader type="schema" isPublic={schema.isPublic}>
				<Pane marginY={majorScale(1)}>
					<Paragraph size={500}>Last updated {updatedAt.toDateString()}</Paragraph>
					<Paragraph size={500}>{schema.description}</Paragraph>
				</Pane>
			</ScopeHeader>
			<ScopeNav navItems={navItems} />
			{children}
		</Pane>
	);
};

export default SchemaPageFrame;
