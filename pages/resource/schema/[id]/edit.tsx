import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetServerSideProps } from "next";

import api from "next-rest/client";

import {
	majorScale,
	Pane,
	Paragraph,
	toaster,
	Button,
	Spinner,
	TickCircleIcon,
	DotIcon,
	Dialog,
	Link,
} from "evergreen-ui";

import { useDebouncedCallback } from "use-debounce";

import { Schema } from "@underlay/apg";

import { SchemaPageFrame, SchemaEditor, ReadmeEditor, Section } from "components";
import { useRouter } from "next/router";

import { LocationContext, useStateRef } from "utils/client/hooks";

import { getResourcePagePermissions } from "utils/server/permissions";

import {
	countSchemaVersions,
	selectResourcePageProps,
	prisma,
	serializeUpdatedAt,
} from "utils/server/prisma";
import { SchemaPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";

// We use an intersection to "augment" the nested schema type
type SchemaEditProps = SchemaPageProps & {
	schema: {
		content: string;
		readme: string;
	};
};

export const getServerSideProps: GetServerSideProps<SchemaEditProps, ResourcePageParams> = async (
	context
) => {
	const { id } = context.params!;

	const schema = await prisma.schema.findFirst({
		where: { id },
		select: {
			...selectResourcePageProps,
			content: true,
			readme: true,
		},
	});

	// The reason to check if schema === null separately from getResourcePagePermissions
	// is so that TypeScript know it's not null afterward
	if (schema === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schema, true)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schema);

	return {
		props: { versionCount, schema: serializeUpdatedAt(schema) },
	};
};

const SchemaEditPage: React.FC<SchemaEditProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug, mode: "edit" }}>
			<SchemaPageFrame {...props}>
				<SchemaEditContent {...props} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

function SchemaEditContent({ schema: { id, content, readme } }: SchemaEditProps) {
	const router = useRouter();

	const [clean, setClean, cleanRef] = useStateRef(true);
	const [saving, setSaving] = useState(false);
	const [publishing, setPublishing] = useState(false);

	const [errorCount, setErrorCount, errorCountRef] = useStateRef(0);

	const schemaRef = useRef<string>(content);
	const readmeRef = useRef<string>(readme);

	const save = useDebouncedCallback(() => {
		setClean(true);
		setSaving(true);
		saveDraft(id, readmeRef.current, schemaRef.current)
			.catch((err) => {
				console.error(err);
				toaster.danger("Could not save draft");
			})
			.finally(() => setSaving(false));
	}, 1000);

	const handleSchemaChange = useCallback(
		(value: string, {}: Schema.Schema, errorCount: number) => {
			if (errorCountRef.current !== errorCount) {
				setErrorCount(errorCount);
			}
			if (schemaRef.current !== value) {
				schemaRef.current = value;
				setClean(false);
				save();
			}
		},
		[]
	);

	const handleReadmeChange = useCallback((value: string) => {
		if (readmeRef.current !== value) {
			readmeRef.current = value;
			setClean(false);
			save();
		}
	}, []);

	const handlePublishVersion = useCallback(() => {
		if (errorCountRef.current > 0) {
			return;
		}

		setPublishing(true);
		publishVersion(id)
			.then(({ location }) => {
				setPublishing(false);
				setClean(true);
				router.push(location);
			})
			.catch((err) => {
				setPublishing(false);
				console.error(err);
				toaster.danger("Could not publish schema version");
			});
	}, []);

	const [openPublishDialog, setOpenPublishDialog] = useState(false);

	useEffect(() => {
		function handleBeforeUnload(event: BeforeUnloadEvent) {
			if (cleanRef.current === false) {
				event.preventDefault();
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "s" && event.metaKey) {
				event.preventDefault();
				if (cleanRef.current === false) {
					save.flush();
				}
			}
		}

		window.addEventListener("beforeunload", handleBeforeUnload);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<>
			<Section title="Content">
				<Pane marginY={majorScale(2)} border>
					<SchemaEditor initialValue={content} onChange={handleSchemaChange} />
				</Pane>
			</Section>
			<Section title="README" useUppercase={false}>
				<Paragraph marginY={majorScale(1)}>
					Readme files are written in{" "}
					<Link size={300} href="https://commonmark.org/">
						markdown
					</Link>{" "}
					and are used to document a specific version of a schema.
				</Paragraph>
				<Pane marginY={majorScale(2)} border>
					<ReadmeEditor initialValue={readme} onChange={handleReadmeChange} />
				</Pane>
			</Section>
			<Pane marginTop={majorScale(4)} display="flex" justifyContent="space-between">
				<Button
					disabled={clean}
					onClick={save.flush}
					iconAfter={saving ? <Spinner /> : clean ? <TickCircleIcon /> : <DotIcon />}
				>
					{saving ? "Saving..." : clean ? "Saved" : "Save"}
				</Button>
				<Button
					intent="success"
					appearance="primary"
					disabled={errorCount > 0}
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
		</>
	);
}

async function saveDraft(id: string, readme: string, content: string): Promise<void> {
	await api.patch(
		"/api/schema/[id]",
		{ id },
		{ "content-type": "application/json" },
		{ content, readme }
	);
}

async function publishVersion(id: string): Promise<{ location: string }> {
	const [headers] = await api.post("/api/schema/[id]", { id }, {}, undefined);
	return headers;
}

export default SchemaEditPage;
