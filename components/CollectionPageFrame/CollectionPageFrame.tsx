import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { CollectionPageProps } from "utils/shared/propTypes";

type CollectionPageFrameProps = CollectionPageProps & { children: React.ReactNode };

const ownerNavItems = (versionCount: number): NavItem[] => [
	{ title: "Overview" },
	{ mode: "versions", title: `Versions (${versionCount})` },
	{ mode: "settings", title: "Settings" },
];

const nonOwnerNavItems = (versionCount: number): NavItem[] => [
	{ title: "Overview" },
	{ mode: "versions", title: `Versions (${versionCount})` },
];

const CollectionPageFrame = ({ collection, versionCount, children }: CollectionPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === collection.agent.user?.id;
	const updatedAt = useMemo(() => new Date(collection.updatedAt), [collection.updatedAt]);
	const navItems = useMemo<NavItem[]>(
		() => (isOwner ? ownerNavItems(versionCount) : nonOwnerNavItems(versionCount)),
		[isOwner, versionCount]
	);

	return (
		<StandardFrame
			scopeHeaderProps={{
				type: "collection",
				detailsTop: <Text>Last updated {updatedAt.toDateString()}</Text>,
				detailsBottom: collection.description,
				isPrivate: !collection.isPublic,
			}}
			scopeNavProps={{ navItems }}
			content={children}
		/>
	);
};

export default CollectionPageFrame;
