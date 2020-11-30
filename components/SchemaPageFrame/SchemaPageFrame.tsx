import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { StandardFrame } from "components";
import { usePageContext } from "utils/client/hooks";

export type SchemaPageHeaderProps = {
	contentSlug: string;
	profileSlug: string;
	versionCount: number;
	currentVersionDate: string;
	currentVersionNumber: string;
	schema: Schema;
	mode?: string;
	submode?: string;
};

export type Schema = {
	id: string;
	description: string;
	agent: { userId: string | null };
	isPublic: boolean;
	updatedAt: string;
};

type SchemaPageFrameProps = SchemaPageHeaderProps & { children: React.ReactNode };

const SchemaPageHeader = ({
	schema,
	versionCount,
	currentVersionDate,
	currentVersionNumber,
	profileSlug,
	contentSlug,
	mode,
	submode,
	children,
}: SchemaPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === schema.agent.userId;
	const updatedAt = useMemo(() => new Date(currentVersionDate), [currentVersionDate]);

	return (
		<StandardFrame
			scopeHeaderProps={{
				type: "schema",
				profileSlug: profileSlug,
				contentSlug: contentSlug,
				detailsTop: (
					<Text color="muted">
						Latest Version: {currentVersionNumber} · {updatedAt.toLocaleDateString()}
						{/* {versionCount === 1 ? "1 version" : `${versionCount} versions`} - last
						updated {updatedAt.toLocaleDateString()} */}
					</Text>
				),

				detailsBottom: schema.description,
				isPrivate: !schema.isPublic,
			}}
			scopeNavProps={{
				navItems: [
					{ slug: "", title: "Overview" },
					{ slug: "edit", title: "Edit", ownerOnly: true },
					{ slug: "versions", title: `Versions (${versionCount})` },
					{ slug: "settings", title: "Settings", ownerOnly: true },
				].filter((item) => {
					return !item.ownerOnly || isOwner;
				}),
				contentType: "schema",
				activeMode: mode,
				activeSubmode: submode,
			}}
			content={children}
		/>
	);
};
export default SchemaPageHeader;
