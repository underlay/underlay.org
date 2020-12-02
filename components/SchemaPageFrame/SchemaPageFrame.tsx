import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { SchemaPageProps } from "utils/shared/propTypes";

type SchemaPageFrameProps = SchemaPageProps & { children: React.ReactNode };

const SchemaPageFrame = ({ schema, versionCount, children }: SchemaPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === schema.agent.user?.id;
	const updatedAt = useMemo(() => new Date(schema.updatedAt), [schema.updatedAt]);
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
				type: "schema",
				detailsTop: (
					<Text color="muted">Last updated at {updatedAt.toLocaleDateString()}</Text>
				),
				detailsBottom: schema.description,
				isPrivate: !schema.isPublic,
			}}
			scopeNavProps={{ navItems }}
			content={children}
		/>
	);
};

export default SchemaPageFrame;
