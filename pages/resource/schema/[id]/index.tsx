import React from "react";
import { GetServerSideProps } from "next";

import { SchemaPageFrame, SchemaVersionOverview } from "components";
import {
	prisma,
	selectSchemaPageProps,
	selectVersionOverviewProps,
	countSchemaVersions,
	serializeUpdatedAt,
	serializeCreatedAt,
} from "utils/server/prisma";
import { getSchemaPagePermissions } from "utils/server/permissions";
import { buildUrl } from "utils/shared/urls";
import { SchemaVersionOverviewProps } from "components/SchemaVersionOverview/SchemaVersionOverview";
import { SchemaPageProps, ResourcePageParams, getProfileSlug } from "utils/shared/propTypes";
import { LocationContext } from "utils/client/hooks";

/** Data fetching!
 * We have two basic goals: try to fetch everything
 * that you need in one query, and factor out common
 * logic whenever you can.
 *
 * For example, lots of pages need to locate a schema or
 * collection based on a profileSlug and a contentSlug,
 * so we use findResourceWhere() in from utils that returns
 * a Primsa.SchemaWhereInput & Prisma.CollectionWhereInput object
 * (meaning we can use it for both/either of them).
 *
 * On most pages, we end up needing some props for e.g. a header
 * component, and other props for e.g. the body content, and often
 * those two intersect in some sense (the content will need a
 * different but overlapping set of properties of the same resource
 * as the header). At some point we have to transform the stuff that
 * we get from prisma (organized "around the data") into stuff we pass
 * into components (organized "around the ui").
 *
 * This should happen *in the client component*, and the props returned
 * from getServerSideProps should be organized "around the data".
 * This is how all data fetching frameworks (like GraphQL) are
 * organized, and we'll have to start thinking this way anyway if we
 * ever start having more complex client-side updating stuff happening.
 */

type SchemaOverviewProps = SchemaPageProps & { latestVersion: SchemaVersionOverviewProps };

export const getServerSideProps: GetServerSideProps<
	SchemaOverviewProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const schemaWithVersion = await prisma.schema.findUnique({
		where: { id },
		select: {
			...selectSchemaPageProps,
			versions: {
				take: 1,
				orderBy: { createdAt: "desc" },
				select: selectVersionOverviewProps,
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

	if (versionCount < 1) {
		const profileSlug = getProfileSlug(schemaWithVersion.agent);
		return {
			redirect: {
				destination: buildUrl({
					profileSlug,
					contentSlug: schemaWithVersion.slug,
					mode: "edit",
				}),
				permanent: false,
			},
		};
	}

	// We need to take the .versions property out
	// before returning as a prop so that react doesn't
	// complain about not being able to serialize Dates
	const {
		versions: [latestVersion],
		...schema
	} = schemaWithVersion;

	return {
		props: {
			versionCount,
			schema: serializeUpdatedAt(schema),
			latestVersion: serializeCreatedAt(latestVersion),
		},
	};
};

const SchemaOverview: React.FC<SchemaOverviewProps> = ({ latestVersion, ...props }) => {
	const profileSlug = getProfileSlug(props.schema.agent);
	const contentSlug = props.schema.slug;
	return (
		<LocationContext.Provider value={{ profileSlug, contentSlug }}>
			<SchemaPageFrame {...props}>
				<SchemaVersionOverview {...latestVersion} />
			</SchemaPageFrame>
		</LocationContext.Provider>
	);
};

export default SchemaOverview;
