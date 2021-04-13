import React, { useMemo } from "react";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { SchemaPageProps } from "utils/shared/propTypes";
import { Text } from "evergreen-ui";

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
		<StandardFrame
			scopeHeaderProps={{
				type: "schema",
				detailsTop: <Text>Last updated on {updatedAt.toDateString()}</Text>,
				detailsBottom: <Text>{schema.description}</Text>,
				isPrivate: !schema.isPublic,
			}}
			scopeNavProps={{ navItems }}
			content={children}
		/>
	);
};

export default SchemaPageFrame;
