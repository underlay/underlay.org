import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Badge,
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

import api from "next-rest/client";

import { SchemaContent, SchemaGraph, SchemaHeader, ReadmeViewer } from "components";

import prisma from "utils/server/prisma";

import { schemaVersonPageSize } from "utils/shared/schemas/versions";
import { nullOption, parseToml, toOption } from "utils/shared/schemas/parse";
import { getCachedSession } from "utils/server/session";
import { usePageContext } from "utils/client/hooks";

type SchemaPageParams = {
	profileSlug: string;
	schemaSlug: string;
};

interface SchemaPageProps {
	notFound: boolean;
	schemaSlug: string;
	profileSlug: string;
	versionCount: number;
	schema: Schema | null;
}

interface Schema {
	id: string;
	description: string;
	agent: { userId: string | null };
	isPublic: boolean;
	updatedAt: string;
	versions: SchemaVersion[];
}

interface SchemaVersion {
	id: string;
	versionNumber: string;
	content: string;
	readme: string | null;
}

export const getServerSideProps: GetServerSideProps<SchemaPageProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, schemaSlug } = context.params!;

	const session = getCachedSession(context);

	const notFoundProps: { props: SchemaPageProps } = {
		props: { notFound: true, profileSlug, schemaSlug, versionCount: 0, schema: null },
	};

	const schema = await prisma.schema.findFirst({
		where: {
			slug: schemaSlug,
			agent: {
				OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
			},
		},
		select: {
			id: true,
			slug: true,
			description: true,
			isPublic: true,
			agent: { select: { userId: true } },
			updatedAt: true,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					versionNumber: true,
					content: true,
					readme: true,
				},
			},
		},
	});

	if (schema === null) {
		return notFoundProps;
	}

	if (!schema.isPublic) {
		if (session === null) {
			return notFoundProps;
		}

		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session.user.id !== schema.agent.userId) {
			return notFoundProps;
		}
	}

	const versionCount = await prisma.schemaVersion.count({ where: { schemaId: schema.id } });

	return {
		props: {
			notFound: false,
			profileSlug,
			schemaSlug,
			versionCount,
			schema: { ...schema, updatedAt: schema.updatedAt.toISOString() },
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

const SchemaPage = ({ schema, versionCount, profileSlug, schemaSlug }: SchemaPageProps) => {
	const [selectedTab, setSelectedTab] = useState<Tab>("about");

	const { session } = usePageContext();

	const isOwner = session !== null && schema !== null && session.user.id === schema.agent.userId;

	const [version] = schema !== null && schema.versions.length > 0 ? schema.versions : [null];

	if (schema === null) {
		return null;
	}

	const updatedAt = new Date(schema.updatedAt);
	const noVersions = versionCount === 0 || version === null;

	return (
		<Pane maxWidth={majorScale(128)} paddingX={majorScale(2)} margin="auto">
			<SchemaHeader profileSlug={profileSlug} schemaSlug={schemaSlug}>
				{schema.isPublic ? null : (
					<Badge
						color="neutral"
						isSolid
						marginRight={8}
						alignSelf="center"
						marginTop={minorScale(1)}
						marginX={majorScale(2)}
					>
						Private
					</Badge>
				)}
			</SchemaHeader>
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
							disabled={noVersions}
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
						href={`/${profileSlug}/schemas/${schemaSlug}/new`}
					>
						New version
					</Button>
				) : null}
			</Pane>
			<Pane>
				{noVersions ? (
					<>
						<Paragraph marginY={majorScale(1)}>
							No versions of this schema have been published.
						</Paragraph>
						{isOwner ? (
							<Paragraph>
								<Link
									href={`/${profileSlug}/schemas/${schemaSlug}/new`}
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
					<SchemaVersionsTab
						profileSlug={profileSlug}
						schemaSlug={schemaSlug}
						schema={schema}
					/>
				) : (
					never(selectedTab)
				)}
			</Pane>
		</Pane>
	);
};

const never = (_: never) => null;

const SchemaAboutTab: React.FC<{ version: SchemaVersion | null }> = ({ version }) => {
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
	schemaSlug: string;
	schema: Schema;
}> = ({ profileSlug, schemaSlug, schema: { id } }) => {
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
							href={`/${profileSlug}/schemas/${schemaSlug}/${versionNumber}`}
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

const SchemaGraphTab: React.FC<{ version: SchemaVersion | null }> = ({ version }) => {
	const result = useMemo(
		() => (version === null ? nullOption : toOption(parseToml(version.content))),
		[version]
	);

	return <Pane>{result._tag === "Some" && <SchemaGraph schema={result.value} />}</Pane>;
};

const SchemaSourceTab: React.FC<{ version: SchemaVersion | null }> = ({ version }) => {
	if (version === null) {
		return null;
	}

	return (
		<Pane>
			<SchemaContent initialValue={version.content} readOnly={true} />
		</Pane>
	);
};

export default SchemaPage;
