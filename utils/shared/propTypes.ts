/**
 * These are types for things that we commonly end up fetching
 * from the database and return from getServerSideProps.
 * Sometimes these have everything a component needs,
 * but they're are here for different purpose than defining any
 * component's props, since components might need other things
 * that didn't come from the database.
 */

export type ResourcePageParams = { id: string };

// These are the basic properties that every resource page needs
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

export type PipelinePageProps = {
	pipeline: ResourceProps;
};

export type UserProps = {
	id: string;
	slug: string | null;
};

// These are the basic agent properties that every resource page needs
export type AgentProps = {
	user: UserProps | null;
	organization: { id: string; slug: string | null } | null;
};

export const getProfileSlug = ({ user, organization }: AgentProps) =>
	user?.slug || organization?.slug || undefined;

export type ResourceVersionProps = {
	id: string;
	versionNumber: string;
	createdAt: string;
	user: UserProps;
};

export type ExecutionProps = {
	id: string;
	createdAt: string;
	user: { id: string; slug: string | null };
	successful: boolean | null;
	executionNumber: string;
};

export type SchemaVersionProps = ResourceVersionProps & {
	content: string;
	readme: string;
};

export type CollectionVersionProps = ResourceVersionProps & {
	readme: string;
	execution: {
		executionNumber: string;
		pipeline: { agent: AgentProps; slug: string; isPublic: boolean };
	};
};
