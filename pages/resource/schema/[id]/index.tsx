import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	prisma,
	selectResourcePageProps,
	selectSchemaVersionOverviewProps,
	countSchemaVersions,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getResourcePagePermissions } from "utils/server/permissions";

import {
	SchemaPageProps,
	ResourcePageParams,
	getProfileSlug,
	SchemaVersionProps,
} from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";
import { Paragraph } from "evergreen-ui";

type SchemaOverviewProps = SchemaPageProps & { lastVersion: SchemaVersionProps | null };

export const getServerSideProps: GetServerSideProps<
	SchemaOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersion = await prisma.schema.findUnique({
		where: { id },
		select: {
			...selectResourcePageProps,
			lastVersion: { select: selectSchemaVersionOverviewProps },
		},
	});

	// The reason to check for null separately from getResourcePagePermissions
	// is so that TypeScript know it's not null afterward
	if (schemaWithVersion === null) {
		return { notFound: true };
	} else if (!getResourcePagePermissions(context, schemaWithVersion, false)) {
		return { notFound: true };
	}

	const versionCount = await countSchemaVersions(schemaWithVersion);

	const { lastVersion, ...schema } = schemaWithVersion;

	return {
		props: {
			versionCount,
			schema: serializeUpdatedAt(schema),
			lastVersion: lastVersion && serializeCreatedAt(lastVersion),
		},
	};
};

const SchemaOverviewPage: React.FC<SchemaOverviewProps> = (props) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;

	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<SchemaPageFrame {...props}>
				{props.lastVersion === null ? (
					<Paragraph fontStyle="italic">No versions yet!</Paragraph>
				) : (
					<SchemaVersionOverview
						schema={props.schema}
						schemaVersion={props.lastVersion}
					/>
				)}
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaOverviewPage;
