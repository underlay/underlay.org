import React from "react";
import { GetServerSideProps } from "next";

import { majorScale, Pane } from "evergreen-ui";

import { ReadmeViewer, SchemaPageFrame, SchemaViewer, VersionNavigator } from "components";

import {
	countSchemaVersions,
	prisma,
	selectResourcePageProps,
	selectSchemaVersionOverviewProps,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";
import {
	SchemaPageProps,
	SchemaVersionProps,
	ResourcePageParams,
	getProfileSlug,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

export type SchemaVersionPageProps = SchemaPageProps & {
	schemaVersion: SchemaVersionProps;
	previousSchemaVersion: { versionNumber: string } | null;
	nextSchemaVersion: { versionNumber: string } | null;
};

export const getServerSideProps: GetServerSideProps<
	SchemaVersionPageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaVersionWithSchema = await prisma.schemaVersion.findUnique({
		where: { id },
		select: {
			...selectSchemaVersionOverviewProps,
			schema: { select: selectResourcePageProps },
			previousVersion: { select: { versionNumber: true } },
			nextVersion: { select: { versionNumber: true } },
		},
	});

	if (schemaVersionWithSchema === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schemaVersionWithSchema.schema, false)) {
		return { notFound: true };
	}

	// We need to take the .schema property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const { schema, previousVersion, nextVersion, ...schemaVersion } = schemaVersionWithSchema;

	const versionCount = await countSchemaVersions(schema);

	return {
		props: {
			versionCount,
			schema: serializeUpdatedAt(schema),
			schemaVersion: serializeCreatedAt(schemaVersion),
			previousSchemaVersion: previousVersion,
			nextSchemaVersion: nextVersion,
		},
	};
};

const SchemaVersionPage: React.FC<SchemaVersionPageProps> = ({
	previousSchemaVersion: previousVersion,
	schemaVersion,
	nextSchemaVersion: nextVersion,
	...props
}) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	const { versionNumber, readme, content } = schemaVersion;

	const previous = previousVersion?.versionNumber || null;
	const next = nextVersion?.versionNumber || null;

	return (
		<LocationContext.Provider
			value={{ profileSlug, contentSlug, versionNumber, mode: "versions" }}
		>
			<SchemaPageFrame {...props}>
				<VersionNavigator
					previous={previous}
					next={next}
					createdAt={schemaVersion.createdAt}
				/>

				<SchemaViewer marginY={majorScale(2)} value={content} />

				<Pane marginY={majorScale(8)}>
					<ReadmeViewer source={readme} />
				</Pane>
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaVersionPage;
