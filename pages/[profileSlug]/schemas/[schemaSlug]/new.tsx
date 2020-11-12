import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Button,
	Dialog,
	DotIcon,
	Heading,
	Link,
	majorScale,
	Pane,
	Paragraph,
	Spinner,
	Switch,
	Text,
	TextInput,
	TickCircleIcon,
	toaster,
} from "evergreen-ui";
import { GetServerSideProps } from "next";

import { useRouter } from "next/router";
import api from "next-rest/client";

import { StatusCodes } from "http-status-codes";

import semverValid from "semver/functions/valid";
import semverInc from "semver/functions/inc";
import semverLt from "semver/functions/lt";
import semverMajor from "semver/functions/major";

import SchemaHeader from "components/SchemaHeader/SchemaHeader";
import ReadmeEditor from "components/ReadmeEditor/ReadmeEditor";
import SchemaEditor, {
	initialSchemaContent,
	ResultType,
} from "components/SchemaEditor/SchemaEditor";

import { getCachedSession } from "utils/server/session";
import prisma from "utils/server/prisma";
import { parseToml, toOption } from "utils/shared/schemas/parse";
import { usePageContext } from "utils/client/hooks";

type NewSchemaVersionPageParams = {
	profileSlug: string;
	schemaSlug: string;
};

interface NewSchemaVersionPageProps {
	notFound: boolean;
	profileSlug: string;
	schemaSlug: string;
	schema: Schema | null;
}

interface Schema {
	id: string;
	description: string;
	agent: { userId: string | null };
	draftVersionNumber: string;
	draftContent: string;
	draftReadme: string | null;
	versions: SchemaVersion[];
}

interface SchemaVersion {
	versionNumber: string;
}

export const getServerSideProps: GetServerSideProps<
	NewSchemaVersionPageProps,
	NewSchemaVersionPageParams
> = async (context) => {
	const { profileSlug, schemaSlug } = context.params!;

	const notFoundProps: { props: NewSchemaVersionPageProps } = {
		props: { notFound: true, profileSlug, schemaSlug, schema: null },
	};

	const session = getCachedSession(context);
	if (session === null) {
		return notFoundProps;
	}

	const schema = await prisma.schema.findFirst({
		where: {
			slug: schemaSlug,
			agent: {
				OR: [{ user: { slug: profileSlug } }, { organization: { slug: profileSlug } }],
			},
		},
		select: {
			id: true,
			agent: { select: { userId: true } },
			description: true,
			draftVersionNumber: true,
			draftContent: true,
			draftReadme: true,
			versions: { take: 1, orderBy: { createdAt: "desc" }, select: { versionNumber: true } },
		},
	});

	if (schema === null) {
		return notFoundProps;
	}

	if (session.user.id !== schema.agent.userId) {
		return notFoundProps;
	}

	return {
		props: {
			notFound: false,
			profileSlug,
			schemaSlug,
			schema,
		},
	};
};

const NewSchemaVersion: React.FC<NewSchemaVersionPageProps> = ({
	schema,
	profileSlug,
	schemaSlug,
}) => {
	const { session } = usePageContext();

	const router = useRouter();

	const previousVersion = useMemo(
		() =>
			schema === null || schema.versions.length === 0
				? null
				: semverValid(schema.versions[0].versionNumber),
		[schema]
	);

	const initialVersion = previousVersion && semverInc(previousVersion, "prerelease");
	const [versionNumber, setVersionNumber] = useState(initialVersion || "0.0.0");

	const handleVersionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
			cleanRef.current = false;
			setClean(false);
			setVersionNumber(value);
		},
		[]
	);

	const [initialContent, initialReadme] =
		schema === null
			? [initialSchemaContent, null]
			: [
					schema.draftContent || initialSchemaContent,
					schema.draftReadme || `# ${schemaSlug}\n\n> ${schema.description}\n\n`,
			  ];

	const initialResult = useMemo<ResultType>(() => toOption(parseToml(initialContent)), [
		initialContent,
	]);

	const contentRef = useRef<string>(initialContent);
	const [result, setResult] = useState<ResultType>(initialResult);

	const [clean, setClean] = useState(true);
	const [saving, setSaving] = useState(false);
	const [publishing, setPublishing] = useState(false);

	const cleanRef = useRef(clean);

	const handleChange = useCallback((value: string, result: ResultType) => {
		cleanRef.current = false;
		setClean(false);
		contentRef.current = value;
		setResult(result);
	}, []);

	const [attachReadme, setAttachReadme] = useState(initialReadme !== null);
	const readmeRef = useRef(initialReadme || "");
	const handleSetReadme = useCallback(
		({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
			cleanRef.current = false;
			setClean(false);
			setAttachReadme(checked);
		},
		[]
	);

	const handleChangeReadme = useCallback((value: string) => {
		setClean(false);
		cleanRef.current = false;
		readmeRef.current = value;
	}, []);

	const handleSaveDraft = useCallback(() => {
		cleanRef.current = true;
		setClean(true);
		if (schema !== null) {
			setSaving(true);
			api.patch(
				"/api/schema/[id]",
				{ id: schema.id },
				{ "content-type": "application/json" },
				{
					draftVersionNumber: versionNumber,
					draftContent: contentRef.current,
					draftReadme: attachReadme ? readmeRef.current : null,
				}
			)
				.then(([{}]) => {
					setSaving(false);
					toaster.success("Saved draft", { duration: 2 });
				})
				.catch((err) => {
					setSaving(false);
					toaster.danger(`Failed to save draft: ${err.toString()}`);
				});
		}
	}, [schema, versionNumber, attachReadme]);

	const isVersionValid = semverValid(versionNumber) !== null && semverMajor(versionNumber) === 0;
	const isVersionMonotonic =
		isVersionValid && (previousVersion === null || semverLt(previousVersion, versionNumber));

	const handlePublishVersion = useCallback(() => {
		if (session !== null && schema !== null && result._tag === "Some" && isVersionMonotonic) {
			setPublishing(true);
			api.post(
				"/api/schema/[id]",
				{ id: schema.id },
				{ "content-type": "application/json" },
				{
					versionNumber: versionNumber,
					content: contentRef.current,
					readme: attachReadme ? readmeRef.current : null,
				}
			)
				.then(([{}]) => {
					setPublishing(false);
					toaster.success(
						`${profileSlug}/schemas/${schemaSlug}@${versionNumber} published successfully`
					);
					router.push(`/${profileSlug}/schemas/${schemaSlug}`);
				})
				.catch((err) => {
					setPublishing(false);
					toaster.danger(
						err === StatusCodes.CONFLICT
							? "Error publishing schema version: version number conflict"
							: `Error publishing schema version: ${err.toString()}`
					);
				});
		}
	}, [profileSlug, schema, versionNumber, isVersionMonotonic, result, attachReadme, session]);

	const [openPublishDialog, setOpenPublishDialog] = useState(false);

	useEffect(() => {
		const onBeforeUnload = (event: BeforeUnloadEvent) => {
			if (cleanRef.current === false) {
				event.preventDefault();
			}
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, []);

	const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "s" && event.metaKey) {
			event.preventDefault();
			if (cleanRef.current === false) {
				handleSaveDraft();
			}
		}
	}, []);

	if (schema === null) {
		router.push(`/${profileSlug}`);
		return null;
	} else if (session === null) {
		router.push(`/${profileSlug}/schemas/${schemaSlug}`);
		return null;
	}

	return (
		<Pane
			maxWidth={majorScale(128)}
			paddingX={majorScale(2)}
			margin="auto"
			onKeyDown={handleKeyDown}
		>
			<NewSchemaVersionHeader profileSlug={profileSlug} schemaSlug={schemaSlug} />

			<Heading marginTop={majorScale(8)}>Version number</Heading>

			<Paragraph marginY={majorScale(1)}>
				Version numbers must be <Link href="https://semver.org/">semver</Link> strings -
				like 0.2.6, 12.0.0-alpha, 5.2.0-rc.1, ...
			</Paragraph>
			<Paragraph marginY={majorScale(1)}>
				Only version numbers with major version 0 can be published while R1 is in beta.
			</Paragraph>
			<TextInput
				autoFocus={true}
				width={majorScale(16)}
				value={versionNumber}
				isInvalid={!isVersionValid || !isVersionMonotonic}
				onChange={handleVersionChange}
			/>

			{isVersionValid && !isVersionMonotonic && (
				<Paragraph marginY={majorScale(1)} color="muted">
					Versions must only increment (last version is {previousVersion || "0.0.0"})
				</Paragraph>
			)}

			<Heading marginTop={majorScale(4)}>Content</Heading>

			<Pane marginY={majorScale(2)}>
				<SchemaEditor initialValue={initialContent} onChange={handleChange} />
			</Pane>

			<Heading marginTop={majorScale(4)}>Readme</Heading>
			<Paragraph marginY={majorScale(1)}>
				Readme files are written in{" "}
				<Link href="https://commonmark.org/" color="neutral">
					markdown
				</Link>{" "}
				and are used to document a specific version of a schema.
			</Paragraph>
			<Pane display="flex" marginY={majorScale(1)}>
				<Text>Attach readme?</Text>
				<Switch
					height={20}
					marginX={majorScale(2)}
					checked={attachReadme}
					onChange={handleSetReadme}
				/>
			</Pane>

			<Pane marginY={majorScale(2)}>
				{attachReadme ? (
					<ReadmeEditor
						initialValue={initialReadme || ""}
						onChange={handleChangeReadme}
					/>
				) : null}
			</Pane>
			<Pane marginTop={majorScale(4)}>
				<Button
					disabled={clean}
					onClick={handleSaveDraft}
					iconAfter={saving ? <Spinner /> : clean ? <TickCircleIcon /> : <DotIcon />}
				>
					Save draft
				</Button>
				<Button
					marginX={majorScale(2)}
					disabled={result._tag === "None" || !isVersionValid || !isVersionMonotonic}
					onClick={() => setOpenPublishDialog(true)}
					iconAfter={publishing ? <Spinner /> : null}
				>
					Publish version
				</Button>
			</Pane>
			<Dialog
				title="Publish new version"
				confirmLabel="Publish"
				isShown={openPublishDialog}
				onCloseComplete={() => setOpenPublishDialog(false)}
				onConfirm={handlePublishVersion}
				preventBodyScrolling={true}
			>
				Are you sure you want to do this?
			</Dialog>
		</Pane>
	);
};

const NewSchemaVersionHeader: React.FC<{ profileSlug: string; schemaSlug: string }> = ({
	profileSlug,
	schemaSlug,
}) => (
	<SchemaHeader profileSlug={profileSlug} schemaSlug={schemaSlug}>
		<Text size={600} marginX={majorScale(1)}>
			/
		</Text>
		<Text size={600}>new version</Text>
	</SchemaHeader>
);

export default NewSchemaVersion;
