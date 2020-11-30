import React from "react";
import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import api from "next-rest/client";
import { Button, majorScale, Pane, Table, Text, toaster } from "evergreen-ui";

import { SchemaPageFrame } from "components";
import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import { getSchemaPageHeaderData, getSchemaPagePermissions } from "utils/server/schemaPages";
import { schemaVersonPageSize } from "utils/shared/schemas/versions";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

interface SchemaOverviewProps {
	schemaPageHeaderProps: SchemaPageHeaderProps;
}

export const getServerSideProps: GetServerSideProps<SchemaOverviewProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;
	const schemaPageHeaderProps = await getSchemaPageHeaderData(profileSlug, contentSlug);
	const hasAccess = getSchemaPagePermissions(context, schemaPageHeaderProps);
	if (!schemaPageHeaderProps || !hasAccess) {
		return { notFound: true };
	}

	return {
		props: {
			schemaPageHeaderProps: {
				...schemaPageHeaderProps,
				mode: "versions",
			},
		},
	};
};

const parseVersion = ({
	id,
	versionNumber,
	createdAt,
	agent: { user, organization },
}: {
	id: string;
	versionNumber: string;
	createdAt: string;
	agent: { user: null | { slug: null | string }; organization: null | { slug: null | string } };
}) => ({
	id,
	versionNumber,
	createdAt: new Date(createdAt),
	slug: user?.slug || organization?.slug || null,
});

const SchemaPage: React.FC<SchemaOverviewProps> = ({ schemaPageHeaderProps }) => {
	const {
		profileSlug,
		contentSlug,
		schema: { id },
	} = schemaPageHeaderProps;
	const [loading, setLoading] = useState(true);
	const [end, setEnd] = useState(false);
	const [versions, setVersions] = useState<
		{ id: string; versionNumber: string; createdAt: Date; slug: null | string }[]
	>([]);

	useEffect(() => {
		api.get("/api/schema/[id]/versions", { id }, { accept: "application/json" }, undefined)
			.then(([{}, versions]) => {
				setLoading(false);
				setVersions(versions.map(parseVersion));
				setEnd(versions.length < schemaVersonPageSize);
			})
			.catch((err) => {
				setLoading(false);
				toaster.danger(`Error retrieving version history: ${err.toString()}`);
			});
	}, [id]);

	const handleClick = useCallback(() => {
		if (loading) {
			return;
		}
		setLoading(true);
		const { id: cursor } = versions[versions.length - 1];
		api.get(
			"/api/schema/[id]/versions",
			{ id, cursor },
			{ accept: "application/json" },
			undefined
		)
			.then(([{}, newVersions]) => {
				setLoading(false);
				setVersions(versions.concat(newVersions.map(parseVersion)));
				setEnd(newVersions.length < 10);
			})
			.catch((err) => {
				setLoading(false);
				toaster.danger(`Error retrieving version history: ${err.toString()}`);
			});
	}, [versions, loading]);

	return (
		<SchemaPageFrame {...schemaPageHeaderProps}>
			<h1>Versions Content</h1>
			<Pane width={majorScale(64)}>
				<Table>
					<Table.Body>
						{versions.map(({ id, versionNumber, createdAt, slug: agentSlug }) => (
							<Table.Row
								key={id}
								is="a"
								href={`/${profileSlug}/schemas/${contentSlug}/versions/${versionNumber}`}
							>
								<Table.TextHeaderCell>{versionNumber}</Table.TextHeaderCell>
								<Table.TextCell>
									{agentSlug ? `@${agentSlug}` : null}
								</Table.TextCell>
								<Table.TextCell>
									{createdAt.toLocaleDateString()} at{" "}
									{createdAt.toLocaleTimeString()}
								</Table.TextCell>
							</Table.Row>
						))}
					</Table.Body>
				</Table>

				<Pane marginY={majorScale(2)}>
					{end ? (
						<Text>End of version history</Text>
					) : (
						<Button isLoading={loading} onClick={handleClick}>
							More
						</Button>
					)}
				</Pane>
			</Pane>
		</SchemaPageFrame>
	);
};
export default SchemaPage;
