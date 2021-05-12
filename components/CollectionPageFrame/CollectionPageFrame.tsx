import React, { useMemo } from "react";
import { majorScale, Pane, Paragraph } from "evergreen-ui";

import { ScopeHeader } from "components";
import ScopeNav, { NavItem } from "components/ScopeNav/ScopeNav";

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
		<Pane>
			<ScopeHeader type="collection" isPublic={collection.isPublic}>
				<Pane marginY={majorScale(1)}>
					<Paragraph size={500}>Last updated {updatedAt.toDateString()}</Paragraph>
					<Paragraph size={500}>{collection.description}</Paragraph>
				</Pane>
			</ScopeHeader>
			<ScopeNav navItems={navItems} />
			{children}
		</Pane>
	);
};

export default CollectionPageFrame;
