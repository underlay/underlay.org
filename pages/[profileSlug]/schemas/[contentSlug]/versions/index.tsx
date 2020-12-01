import React from "react";
import { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import api from "next-rest/client";
import { Button, majorScale, Pane, Table, Text, toaster } from "evergreen-ui";

import { SchemaPageFrame } from "components";
import { getSchemaPagePermissions } from "utils/server/permissions";
import { schemaVersonPageSize } from "utils/shared/schemas/versions";
import {
	prisma,
	findResourceWhere,
	selectSchemaPageProps,
	countSchemaVersions,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { SchemaPageParams, SchemaPageProps } from "utils/server/schemaPage";

type SchemaOverviewProps = SchemaPageProps & { schema: { id: string } };

export const getServerSideProps: GetServerSideProps<SchemaOverviewProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;

	const schema = await prisma.schema.findFirst({
		where: findResourceWhere(profileSlug, contentSlug),
		select: selectSchemaPageProps,
	});

	if (schema === null) {
		return { notFound: true };
	} else if (!getSchemaPagePermissions(context, schema)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schema);

	return {
		props: {
			mode: "versions",
			profileSlug,
			contentSlug,
			schema: serializeUpdatedAt(schema),
			versionCount,
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

const SchemaPage: React.FC<SchemaOverviewProps> = (props) => {
	const { profileSlug, contentSlug, schema } = props;

	const [loading, setLoading] = useState(true);
	const [end, setEnd] = useState(false);
	const [versions, setVersions] = useState<
		{ id: string; versionNumber: string; createdAt: Date; slug: null | string }[]
	>([]);

	useEffect(() => {
		api.get(
			"/api/schema/[id]/versions",
			{ id: schema.id },
			{ accept: "application/json" },
			undefined
		)
			.then(([{}, versions]) => {
				setLoading(false);
				setVersions(versions.map(parseVersion));
				setEnd(versions.length < schemaVersonPageSize);
			})
			.catch((err) => {
				setLoading(false);
				toaster.danger(`Error retrieving version history: ${err.toString()}`);
			});
	}, [schema.id]);

	const handleClick = useCallback(() => {
		if (loading) {
			return;
		}
		setLoading(true);
		const { id: cursor } = versions[versions.length - 1];
		api.get(
			"/api/schema/[id]/versions",
			{ id: schema.id, cursor },
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
		<SchemaPageFrame {...props}>
			<h1>Version History</h1>
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
