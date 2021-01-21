/**
 * These are types for things that we commonly end up fetching
 * from the database and return from getServerSideProps.
 * Sometimes these have everything a component needs,
 * but they're are here for different purpose than defining any
 * component's props, since components might need other things
 * that didn't come from the database.
 */

export type ResourcePageParams = { id: string };

// These are the basic properties that every schema and collection page needs
export type ResourceProps = {
	id: string;
	description: string;
	slug: string;
	agent: AgentProps;
	isPublic: boolean;
	updatedAt: string;
};

// These are the basic properties that every schema page needs
export type SchemaPageProps = {
	versionCount: number;
	schema: ResourceProps;
};

export type CollectionPageProps = {
	versionCount: number;
	collection: ResourceProps;
};

// These are the basic agent properties that every resource page needs
export type AgentProps = {
	user: { id: string; slug: string | null } | null;
	organization: { id: string; slug: string | null } | null;
};

export const getProfileSlug = ({
	user,
	organization,
}: {
	user: null | { slug: null | string };
	organization: null | { slug: null | string };
}) => user?.slug || organization?.slug || undefined;

export type SchemaVersionProps = {
	versionNumber: string;
	content: string;
	readme: string | null;
	createdAt: string;
};

export type CollectionVersionProps = {
	versionNumber: string;
	readme: string | null;
	createdAt: string;
};
