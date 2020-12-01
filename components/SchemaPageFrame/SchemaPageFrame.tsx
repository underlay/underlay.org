import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { NavItem } from "components/ScopeNav/ScopeNav";

import { usePageContext } from "utils/client/hooks";
import { SchemaPageProps } from "utils/server/propTypes";

type SchemaPageFrameProps = SchemaPageProps & { children: React.ReactNode };

const SchemaPageFrame = ({
	schema,
	versionCount,
	profileSlug,
	contentSlug,
	mode,
	submode,
	children,
}: SchemaPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === schema.agent.userId;
	const updatedAt = useMemo(() => new Date(schema.updatedAt), [schema.updatedAt]);
	const navItems = useMemo<NavItem[]>(
		() =>
			isOwner
				? [
						{ slug: "", title: "Overview" },
						{ slug: "edit", title: "Edit" },
						{ slug: "versions", title: `Versions (${versionCount})` },
						{ slug: "settings", title: "Settings" },
				  ]
				: [
						{ slug: "", title: "Overview" },
						{ slug: "versions", title: `Versions (${versionCount})` },
				  ],
		[isOwner, versionCount]
	);

	return (
		<StandardFrame
			scopeHeaderProps={{
				type: "schema",
				profileSlug: profileSlug,
				contentSlug: contentSlug,
				detailsTop: (
					<Text color="muted">Last updated at {updatedAt.toLocaleDateString()}</Text>
				),
				detailsBottom: schema.description,
				isPrivate: !schema.isPublic,
			}}
			scopeNavProps={{
				navItems: navItems,
				contentType: "schema",
				activeMode: mode,
				activeSubmode: submode,
			}}
			content={children}
		/>
	);
};

export default SchemaPageFrame;
