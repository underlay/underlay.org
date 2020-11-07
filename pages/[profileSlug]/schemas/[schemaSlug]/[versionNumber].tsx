import { Heading, majorScale, minorScale, Pane, Paragraph, Tab, Tablist, Text } from "evergreen-ui";

import { GetServerSideProps } from "next";

import { useMemo, useState } from "react";

import semverValid from "semver/functions/valid";

import { SchemaContent, SchemaGraph, SchemaHeader, ReadmeViewer } from "components";

import { getSession } from "utils/shared/session";
import prisma from "utils/server/prisma";
import { SerializedSchemaVersion, serializeSchemaVersion } from "utils/shared/schemas/serialize";
import { nullOption, parseToml, toOption } from "utils/shared/schemas/parse";

interface SchemaProps {
	profileSlug: string;
	schemaSlug: string;
	serverSideNotFound: boolean;
	version: null | (SerializedSchemaVersion & { schema: { isPublic: boolean; agentId: string } });
}

type SchemaParams = {
	profileSlug: string;
	schemaSlug: string;
	versionNumber: string;
};

export const getServerSideProps: GetServerSideProps<SchemaProps, SchemaParams> = async (
	context
) => {
	const { profileSlug, schemaSlug, versionNumber } = context.params!;

	const notFoundProps: { props: SchemaProps } = {
		props: { profileSlug, schemaSlug, serverSideNotFound: true, version: null },
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
		include: { schema: { select: { isPublic: true, agentId: true } } },
	});

	if (version === null) {
		return notFoundProps;
	}

	if (!version.schema.isPublic) {
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
		if (session.user.agentId !== version.schema.agentId) {
			return notFoundProps;
		}
	}

	const { schema, ...rest } = version;

	return {
		props: {
			profileSlug,
			schemaSlug,
			serverSideNotFound: false,
			version: { schema, ...serializeSchemaVersion(rest) },
		},
	};
};

type Tab = "about" | "graph" | "source";

const tabs: { label: string; value: Tab }[] = [
	{ label: "About", value: "about" },
	{ label: "Graph", value: "graph" },
	{ label: "Source", value: "source" },
];

const SchemaVersionOverview = ({ version, profileSlug, schemaSlug }: SchemaProps) => {
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

export default SchemaVersionOverview;
