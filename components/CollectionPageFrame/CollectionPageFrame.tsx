import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { CollectionPageProps } from "utils/shared/propTypes";

type CollectionPageFrameProps = CollectionPageProps & { children: React.ReactNode };

const CollectionPageFrame = ({ collection, versionCount, children }: CollectionPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === collection.agent.user?.id;
	const updatedAt = useMemo(() => new Date(collection.updatedAt), [collection.updatedAt]);
	const navItems = useMemo<NavItem[]>(
		() =>
			isOwner
				? [
						{ title: "Overview" },
						{ mode: "edit", title: "Edit" },
						{ mode: "versions", title: `Versions (${versionCount})` },
						{ mode: "settings", title: "Settings" },
				  ]
				: [
						{ title: "Overview" },
						{ mode: "versions", title: `Versions (${versionCount})` },
				  ],
		[isOwner, versionCount]
	);

	return (
		<StandardFrame
			scopeHeaderProps={{
				type: "collection",
				detailsTop: (
					<Text color="muted">Last updated at {updatedAt.toLocaleDateString()}</Text>
				),
				detailsBottom: collection.description,
				isPrivate: !collection.isPublic,
			}}
			scopeNavProps={{ navItems }}
			content={children}
		/>
	);
};

export default CollectionPageFrame;
