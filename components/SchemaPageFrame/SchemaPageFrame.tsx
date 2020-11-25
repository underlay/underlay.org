import React, { useMemo } from "react";
import { Text } from "evergreen-ui";

import { ScopeHeader, ScopeNav } from "components";
import { usePageContext } from "utils/client/hooks";

export type SchemaPageHeaderProps = {
	contentSlug: string;
	profileSlug: string;
	versionCount: number;
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
	profileSlug,
	contentSlug,
	mode,
	submode,
	children,
}: SchemaPageFrameProps) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === schema.agent.userId;
	const updatedAt = useMemo(() => new Date(schema.updatedAt), [schema.updatedAt]);

	return (
		<React.Fragment>
			<ScopeHeader
				type="schema"
				profileSlug={profileSlug}
				contentSlug={contentSlug}
				detailsTop={
					<Text color="muted">
						{versionCount === 1 ? "1 version" : `${versionCount} versions`} - last
						updated {updatedAt.toLocaleDateString()}
					</Text>
				}
				detailsBottom={schema.description}
				isPrivate={schema.isPublic}
			/>
			<div className="content-indent">
				<ScopeNav
					navItems={[
						{ slug: "", title: "Overview" },
						{ slug: "edit", title: "Edit", ownerOnly: true },
						{ slug: "versions", title: "Versions" },
						{ slug: "settings", title: "Settings" },
					].filter((item) => {
						return !item.ownerOnly || isOwner;
					})}
					contentType="schema"
					activeMode={mode}
					activeSubmode={submode}
				/>
				{children}
			</div>
		</React.Fragment>
	);
};
export default SchemaPageHeader;
