import { Heading, majorScale, minorScale, Pane, Paragraph, Tab, Tablist, Text } from "evergreen-ui";

import { GetServerSideProps } from "next";

import { useMemo, useState } from "react";

import semverValid from "semver/functions/valid";

import { SchemaContent, SchemaGraph, SchemaHeader, ReadmeViewer } from "components";

import prisma from "utils/server/prisma";
import { nullOption, parseToml, toOption } from "utils/shared/schemas/parse";
import { getCachedSession } from "utils/server/session";

type SchemaVersionPageParams = {
	profileSlug: string;
	schemaSlug: string;
	versionNumber: string;
};

interface SchemaVersionPageProps {
	notFound: boolean;
	profileSlug: string;
	schemaSlug: string;
	version: null | SchemaVersion;
}

interface SchemaVersion {
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
	schema: { isPublic: boolean; agent: { userId: null | string } };
}

export const getServerSideProps: GetServerSideProps<
	SchemaVersionPageProps,
	SchemaVersionPageParams
> = async (context) => {
	const { profileSlug, schemaSlug, versionNumber } = context.params!;

	const session = getCachedSession(context);

	const notFoundProps: { props: SchemaVersionPageProps } = {
		props: { profileSlug, schemaSlug, version: null, notFound: true },
	};

	if (semverValid(versionNumber) === null) {
		return notFoundProps;
	}

	const version = await prisma.schemaVersion.findFirst({
		where: {
			versionNumber,
			schema: {
				agent: {
					OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
				},
				slug: schemaSlug,
			},
		},
		select: {
			versionNumber: true,
			content: true,
			readme: true,
			createdAt: true,
			schema: { select: { isPublic: true, agent: { select: { userId: true } } } },
		},
	});

	if (version === null) {
		return notFoundProps;
	}

	if (!version.schema.isPublic) {
		// We only have to access the session if the schema isn't public.
		// This reduces the number of times we need to invoke the session
		// handler, which is good to minimize.

		if (session === null) {
			return notFoundProps;
		}

		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session.user.id !== version.schema.agent.userId) {
			return notFoundProps;
		}
	}

	return {
		props: {
			notFound: false,
			profileSlug,
			schemaSlug,
			version: { ...version, createdAt: version.createdAt.toISOString() },
		},
	};
};

type Tab = "about" | "graph" | "source";

const tabs: { label: string; value: Tab }[] = [
	{ label: "About", value: "about" },
	{ label: "Graph", value: "graph" },
	{ label: "Source", value: "source" },
];

const SchemaVersionPage = ({ version, profileSlug, schemaSlug }: SchemaVersionPageProps) => {
	const [selectedTab, setSelectedTab] = useState<Tab>("about");

	if (version === null) {
		return null;
	}

	const createdAt = new Date(version.createdAt);

	return (
		<Pane maxWidth={majorScale(128)} paddingX={majorScale(2)} margin="auto">
			<SchemaHeader profileSlug={profileSlug} schemaSlug={schemaSlug}>
				<Text size={600} marginX={majorScale(1)}>
					/
				</Text>
				<Heading
					size={600}
					is="a"
					href={`/${profileSlug}/schemas/${schemaSlug}/${version.versionNumber}`}
				>
					{version.versionNumber}
				</Heading>
			</SchemaHeader>
			<Pane marginY={minorScale(3)}>
				<Text color="muted">
					Published on {createdAt.toLocaleDateString()} at{" "}
					{createdAt.toLocaleTimeString()}
				</Text>
			</Pane>

			<Pane marginY={majorScale(4)} display="flex">
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
			</Pane>
			<Pane>
				{selectedTab === "about" ? (
					<SchemaAboutTab version={version} />
				) : selectedTab === "graph" ? (
					<SchemaGraphTab version={version} />
				) : selectedTab === "source" ? (
					<SchemaSourceTab version={version} />
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

export default SchemaVersionPage;
