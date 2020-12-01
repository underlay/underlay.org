import { GetServerSideProps } from "next";

import { SchemaPageHeaderProps } from "components/SchemaPageFrame/SchemaPageFrame";
import { getSchemaPagePermissions } from "utils/server/permissions";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	Link,
	majorScale,
	Pane,
	Paragraph,
	Switch,
	TextInput,
	toaster,
	Text,
	Button,
	Spinner,
	TickCircleIcon,
	DotIcon,
	Dialog,
} from "evergreen-ui";
import { Text as CodeMirrorText } from "@codemirror/next/text";
import { UpdateProps } from "@underlay/tasl-codemirror";
import api from "next-rest/client";

import { StatusCodes } from "http-status-codes";

import semverValid from "semver/functions/valid";
import semverInc from "semver/functions/inc";
import semverLt from "semver/functions/lt";
import semverMajor from "semver/functions/major";

import { SchemaPageFrame, SchemaEditor, ReadmeEditor, Section } from "components";
import { useRouter } from "next/router";
import { buildUrl } from "utils/shared/urls";

import {
	countSchemaVersions,
	findResourceWhere,
	selectSchemaPageProps,
	prisma,
	serializeUpdatedAt,
} from "utils/server/prisma";

type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

// We use an intersection to "augment" the nested schema type
type SchemaEditProps = SchemaPageHeaderProps & {
	schema: {
		id: string;
		draftVersionNumber: string;
		draftContent: string;
		draftReadme: string | null;
	};
	latestVersion: { versionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<SchemaEditProps, SchemaPageParams> = async (
	context
) => {
	const { profileSlug, contentSlug } = context.params!;

	const schemaWithVersion = await prisma.schema.findFirst({
		where: findResourceWhere(profileSlug, contentSlug),
		select: {
			...selectSchemaPageProps,
			draftVersionNumber: true,
			draftContent: true,
			draftReadme: true,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: { versionNumber: true },
			},
		},
	});

	// The reason to check if schema === null separately from getSchemaPagePermissions
	// is so that TypeScript know it's not null afterward
	if (schemaWithVersion === null) {
		return { notFound: true };
	} else if (!getSchemaPagePermissions(context, schemaWithVersion)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schemaWithVersion);

	const { versions, ...schema } = schemaWithVersion;
	const latestVersion = versions.length > 0 ? versions[0] : null;

	return {
		props: {
			mode: "edit",
			profileSlug,
			contentSlug,
			versionCount,
			latestVersion,
			schema: serializeUpdatedAt(schema),
		},
	};
};

const SchemaEdit: React.FC<SchemaEditProps> = (props) => {
	const { profileSlug, contentSlug, schema, latestVersion } = props;
	const { id, draftVersionNumber, draftContent, draftReadme } = schema;
	const router = useRouter();

	const cleanRef = useRef(true);
	const [clean, setClean] = useState(true);
	const [saving, setSaving] = useState(false);
	const [publishing, setPublishing] = useState(false);

	const [versionNumber, setVersionNumber] = useState(draftVersionNumber || "0.0.0");
	const lastestVersionNumber = useMemo(
		() => latestVersion && semverValid(latestVersion.versionNumber),
		[latestVersion]
	);

	const handleVersionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
			cleanRef.current = false;
			setClean(false);
			setVersionNumber(value);
		},
		[]
	);

	const [errorCount, setErrorCount] = useState(0);

	const doc = useRef<CodeMirrorText | null>(null);

	const handleChange = useCallback((props: UpdateProps) => {
		setErrorCount(props.errors);
		setClean(false);
		cleanRef.current = false;
		doc.current = props.state.doc;
	}, []);

	const readme = useRef<CodeMirrorText | null>(null);
	const [attachReadme, setAttachReadme] = useState(draftReadme !== null);
	const handleSetReadme = useCallback(
		({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => {
			cleanRef.current = false;
			setClean(false);
			setAttachReadme(checked);
		},
		[]
	);

	const handleChangeReadme = useCallback((value: CodeMirrorText) => {
		setClean(false);
		cleanRef.current = false;
		readme.current = value;
	}, []);

	const handleSaveDraft = useCallback(() => {
		const content = doc.current === null ? draftContent : doc.current.toString();
		const readmeContent = attachReadme
			? readme.current === null
				? draftReadme
				: readme.current.toString()
			: null;

		cleanRef.current = true;
		setClean(true);
		setSaving(true);
		api.patch(
			"/api/schema/[id]",
			{ id },
			{ "content-type": "application/json" },
			{
				draftVersionNumber: versionNumber,
				draftContent: content,
				draftReadme: readmeContent,
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
	}, [id, versionNumber, attachReadme]);

	const isVersionValid = semverValid(versionNumber) !== null && semverMajor(versionNumber) === 0;
	const isVersionMonotonic =
		isVersionValid &&
		(lastestVersionNumber === null || semverLt(lastestVersionNumber, versionNumber));

	const handlePublishVersion = useCallback(() => {
		if (errorCount === 0 && isVersionMonotonic) {
			setPublishing(true);

			const content = doc.current === null ? draftContent : doc.current.toString();
			const readmeContent = attachReadme
				? readme.current === null
					? draftReadme
					: readme.current.toString()
				: null;

			publishVersion(id, versionNumber, content, readmeContent)
				.then(() => {
					setPublishing(false);
					toaster.success(
						`${profileSlug}/${contentSlug}/${versionNumber} published successfully`
					);
					router.push(buildUrl({ profileSlug, contentSlug, type: "schema" }));
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
	}, [profileSlug, versionNumber, isVersionMonotonic, attachReadme]);

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
	return (
		<SchemaPageFrame {...props}>
			<Pane onKeyDown={handleKeyDown}>
				<Section title="Version Number" useMargin>
					<Paragraph marginY={majorScale(1)}>
						Version numbers must be <Link href="https://semver.org/">semver</Link>{" "}
						strings - like 0.2.6, 12.0.0-alpha, 5.2.0-rc.1, ...
					</Paragraph>
					<Paragraph marginY={majorScale(1)}>
						Only version numbers with major version 0 can be published while R1 is in
						beta.
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
							Versions must only increment (last version is{" "}
							{lastestVersionNumber || "0.0.0"})
						</Paragraph>
					)}
				</Section>
				<Section title="Content" useMargin>
					<Pane marginY={majorScale(2)}>
						<SchemaEditor initialValue={draftContent} onChange={handleChange} />
					</Pane>
				</Section>
				<Section title="Readme" useMargin>
					<Paragraph marginY={majorScale(1)}>
						Readme files are written in <a href="https://commonmark.org/">markdown</a>{" "}
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
								initialValue={draftReadme || ""}
								onChange={handleChangeReadme}
							/>
						) : null}
					</Pane>
				</Section>
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
						disabled={errorCount > 0 || !isVersionValid || !isVersionMonotonic}
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
		</SchemaPageFrame>
	);
};

async function publishVersion(
	id: string,
	versionNumber: string,
	content: string,
	readme: string | null
) {
	await api.post(
		"/api/schema/[id]",
		{ id },
		{ "content-type": "application/json" },
		{
			versionNumber: versionNumber,
			content: content,
			readme: readme,
		}
	);

	const nextVersion = semverInc(versionNumber, "prerelease");

	await api.patch(
		"/api/schema/[id]",
		{ id },
		{ "content-type": "application/json" },
		{
			draftVersionNumber: nextVersion || versionNumber,
			draftContent: content,
			draftReadme: readme,
		}
	);
}

export default SchemaEdit;
