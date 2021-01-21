import React from "react";
import { useCallback, useEffect, useState } from "react";

import api from "next-rest/client";
import { Button, majorScale, Pane, Table, Text, toaster } from "evergreen-ui";

import { schemaVersonPageSize } from "utils/shared/schemas/versions";

import { getProfileSlug } from "utils/shared/propTypes";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";
import Section from "components/Section/Section";

export interface SchemaVersionListProps {
	schema: { id: string };
}

const SchemaVersionList: React.FC<SchemaVersionListProps> = ({ schema: { id } }) => {
	const { profileSlug, contentSlug } = useLocationContext();

	const [loading, setLoading] = useState(true);
	const [end, setEnd] = useState(false);
	const [versions, setVersions] = useState<
		{ id: string; versionNumber: string; createdAt: Date; slug?: string }[]
	>([]);

	useEffect(() => {
		api.get("/api/schema/[id]/versions", { id }, { accept: "application/json" }, undefined)
			.then(([{}, versions]) => {
				setLoading(false);
				setVersions(
					versions.map(({ agent, createdAt, ...rest }) => ({
						createdAt: new Date(createdAt),
						slug: getProfileSlug(agent),
						...rest,
					}))
				);
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
				setVersions(
					versions.concat(
						newVersions.map(({ agent, createdAt, ...rest }) => ({
							createdAt: new Date(createdAt),
							slug: getProfileSlug(agent),
							...rest,
						}))
					)
				);
				setEnd(newVersions.length < 10);
			})
			.catch((err) => {
				setLoading(false);
				toaster.danger(`Error retrieving version history: ${err.toString()}`);
			});
	}, [versions, loading]);

	return (
		<Pane>
			<Section title="Version history">
				<Table>
					<Table.Body>
						{versions.map(({ id, versionNumber, createdAt, slug: agentSlug }) => (
							<Table.Row
								key={id}
								is="a"
								href={buildUrl({ profileSlug, contentSlug, versionNumber })}
							>
								<Table.TextHeaderCell flexBasis={120} flexGrow={0}>
									{versionNumber}
								</Table.TextHeaderCell>
								<Table.TextCell flexBasis={240} flexGrow={0}>
									{agentSlug ? `@${agentSlug}` : null}
								</Table.TextCell>
								<Table.TextCell>
									{createdAt.toDateString()} at {createdAt.toLocaleTimeString()}
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
			</Section>
		</Pane>
	);
};

export default SchemaVersionList;
