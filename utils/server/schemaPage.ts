/**
 * These are types for things that we commonly end up fetching
 * from the database and return from getServerSideProps.
 * Sometimes these have everything a component needs,
 * but they're are here for different purpose than defining any
 * component's props, since components might need other things
 * that didn't come from the database.
 */

export type SchemaPageParams = {
	profileSlug: string;
	contentSlug: string;
};

export type SchemaPageProps = {
	profileSlug: string;
	contentSlug: string;
	mode?: string;
	submode?: string;
	versionCount: number;
	schema: SchemaProps;
};

export type SchemaProps = {
	description: string;
	agent: { userId: string | null };
	isPublic: boolean;
	updatedAt: string;
};

export type SchemaVersionPageParams = SchemaPageParams & { versionNumber: string };

export type SchemaVersionProps = {
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
};
