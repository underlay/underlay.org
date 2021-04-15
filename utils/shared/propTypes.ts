/**
 * These are types for things that we commonly end up fetching
 * from the database and return from getServerSideProps.
 * Sometimes these have everything a component needs,
 * but they're are here for different purpose than defining any
 * component's props, since components might need other things
 * that didn't come from the database.
 */

export type ResourcePageParams = { id: string };

// These are the basic properties that identify a resource;
// e.g. just the parts we need to link *to* it from a related page
export type ResourceProps = {
	agent: AgentProps;
	slug: string;
	isPublic: boolean;
};

// These are the basic properties that every resource page needs;
// e.g. the parts we want to display on its own page.
export type ResourceContentProps = ResourceProps & {
	id: string;
	description: string;
	updatedAt: string;
};

// These are the basic properties that every schema page needs
export type SchemaPageProps = {
	versionCount: number;
	schema: ResourceContentProps;
};

// These are the basic properties that every collection page needs
export type CollectionPageProps = {
	versionCount: number;
	collection: ResourceContentProps;
};

// These are the basic properties that every pipeline page needs
export type PipelinePageProps = {
	pipeline: ResourceContentProps;
};

export type UserProps = {
	id: string;
	slug: string | null;
};

// These are the basic agent properties that every resource page needs
export type AgentProps = {
	user: UserProps | null;
	organization: UserProps | null;
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
	user: UserProps;
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
		pipeline: ResourceProps;
	};
};
