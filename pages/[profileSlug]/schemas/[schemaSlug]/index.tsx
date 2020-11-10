import {
	Button,
	Link,
	majorScale,
	minorScale,
	Pane,
	Paragraph,
	Tab,
	Table,
	Tablist,
	Text,
	toaster,
} from "evergreen-ui";

import { GetServerSideProps } from "next";

import { useCallback, useEffect, useMemo, useState } from "react";

import api from "next-rest/client";

import { SchemaContent, SchemaGraph, SchemaHeader, ReadmeViewer } from "components";

import { usePageContext } from "utils/client/hooks";
import { getSession } from "utils/shared/session";
import prisma from "utils/server/prisma";
import {
	serializeSchemaWithVersions,
	SerializedSchemaWithVersions,
	SerializedSchemaVersion,
} from "utils/shared/schemas/serialize";
import { schemaVersonPageSize } from "utils/shared/schemas/versions";
import { nullOption, parseToml, toOption } from "utils/shared/schemas/parse";

interface SchemaProps {
	profileSlug: string;
	serverSideNotFound: boolean;
	schema: SerializedSchemaWithVersions | null;
	versionCount: number;
}

type SchemaParams = {
	profileSlug: string;
	schemaSlug: string;
};

export const getServerSideProps: GetServerSideProps<SchemaProps, SchemaParams> = async (
	context
) => {
	const { profileSlug, schemaSlug } = context.params!;

	const notFoundProps: { props: SchemaProps } = {
		props: { profileSlug, serverSideNotFound: true, schema: null, versionCount: 0 },
	};

	const schema = await prisma.schema.findFirst({
		where: {
			slug: schemaSlug,
			agent: {
				OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
			},
		},
		include: {
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					versionNumber: true,
					content: true,
					readme: true,
					createdAt: true,
				},
			},
		},
	});

	if (schema === null) {
		return notFoundProps;
	}

	if (!schema.isPublic) {
		// We only have to access the session if the schema isn't public.
		// This reduces the number of times we need to invoke the session
		// handler, which is good to minimize.

		// @ts-expect-error (I think this is a mistake with the next-auth typings - not sure)
		const session = await getSession(context);
		if (session === null) {
			return notFoundProps;
		}

		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session.user.agentId !== schema.agentId) {
			return notFoundProps;
		}
	}

	const versionCount = await prisma.schemaVersion.count({ where: { schemaId: schema.id } });

	return {
		props: {
			profileSlug,
			serverSideNotFound: false,
			schema: serializeSchemaWithVersions(schema),
			versionCount,
		},
	};
};

type Tab = "about" | "graph" | "source" | "versions";

const tabs: { label: string; value: Tab }[] = [
	{ label: "About", value: "about" },
	{ label: "Graph", value: "graph" },
	{ label: "Source", value: "source" },
	{ label: "Version history", value: "versions" },
];

const SchemaOverview = ({ schema, versionCount, profileSlug }: SchemaProps) => {
	const [selectedTab, setSelectedTab] = useState<Tab>("about");

	const { session } = usePageContext();

	const isOwner = session !== null && schema !== null && session.user.agentId === schema.agentId;

	const [version] = schema !== null && schema.versions.length > 0 ? schema.versions : [null];

	if (schema === null) {
		return null;
	}

	const updatedAt = new Date(schema.updatedAt);

	return (
		<Pane maxWidth={majorScale(128)} paddingX={majorScale(2)} margin="auto">
			<SchemaHeader profileSlug={profileSlug} schemaSlug={schema.slug} />
			<Pane marginY={minorScale(3)}>
				<Text color="muted">
					{versionCount === 1 ? "1 version" : `${versionCount} versions`} - last updated{" "}
					{updatedAt.toLocaleDateString()}
				</Text>
			</Pane>
			<Pane display="flex" alignItems="center" marginY={minorScale(3)}>
				{schema.description === "" ? (
					<Paragraph fontStyle="italic" color="muted">
						No description available
					</Paragraph>
				) : (
					<Paragraph size={500}>{schema.description}</Paragraph>
				)}
			</Pane>

			<Pane marginY={majorScale(4)} display="flex" alignItems="center">
				<Tablist userSelect="none">
					{tabs.map(({ label, value }) => (
						<Tab
							key={value}
							onSelect={() => setSelectedTab(value)}
							isSelected={value === selectedTab}
						>
							{label}
						</Tab>
					))}
				</Tablist>
				{isOwner ? (
					<Button
						appearance="minimal"
						marginX={majorScale(2)}
						is="a"
						href={`/${profileSlug}/schemas/${schema.slug}/new`}
					>
						New version
					</Button>
				) : null}
			</Pane>
			<Pane>
				{versionCount === 0 || schema.versions.length === 0 ? (
					<>
						<Paragraph marginY={majorScale(1)}>
							No versions of this schema have been published.
						</Paragraph>
						{isOwner ? (
							<Paragraph>
								<Link
									href={`/${profileSlug}/schemas/${schema.slug}/new`}
									color="neutral"
								>
									Create an initial version
								</Link>{" "}
								to get started.
							</Paragraph>
						) : null}
					</>
				) : selectedTab === "about" ? (
					<SchemaAboutTab version={version} />
				) : selectedTab === "graph" ? (
					<SchemaGraphTab version={version} />
				) : selectedTab === "source" ? (
					<SchemaSourceTab version={version} />
				) : selectedTab === "versions" ? (
					<SchemaVersionsTab profileSlug={profileSlug} schema={schema} />
				) : (
					never(selectedTab)
				)}
			</Pane>
		</Pane>
	);
};

const never = (_: never) => null;

const SchemaAboutTab: React.FC<{ version: SerializedSchemaVersion | null }> = ({ version }) => {
	if (version === null) {
		return null;
	}

	return (
		<Pane>
			{version.readme === null ? (
				<Paragraph fontStyle="italic" color="muted">
					No readme
				</Paragraph>
			) : (
				<ReadmeViewer source={version.readme} />
			)}
		</Pane>
	);
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

const SchemaVersionsTab: React.FC<{
	profileSlug: string;
	schema: SerializedSchemaWithVersions;
}> = ({ profileSlug, schema: { id, slug } }) => {
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
		<Pane width={majorScale(64)}>
			<Table>
				<Table.Body>
					{versions.map(({ id, versionNumber, createdAt, slug: agentSlug }) => (
						<Table.Row
							key={id}
							is="a"
							href={`/${profileSlug}/schemas/${slug}/${versionNumber}`}
						>
							<Table.TextHeaderCell>{versionNumber}</Table.TextHeaderCell>
							<Table.TextCell>{agentSlug ? `@${agentSlug}` : null}</Table.TextCell>
							<Table.TextCell>
								{createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
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
	);
};

const SchemaGraphTab: React.FC<{ version: SerializedSchemaVersion | null }> = ({ version }) => {
	const result = useMemo(
		() => (version === null ? nullOption : toOption(parseToml(version.content))),
		[version]
	);

	return <Pane>{result._tag === "Some" && <SchemaGraph schema={result.value} />}</Pane>;
};

const SchemaSourceTab: React.FC<{ version: SerializedSchemaVersion | null }> = ({ version }) => {
	if (version === null) {
		return null;
	}

	return (
		<Pane>
			<SchemaContent initialValue={version.content} readOnly={true} />
		</Pane>
	);
};

export default SchemaOverview;
