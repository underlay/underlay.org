type LocalUser = {
	id: string;
	name: string;
	avatar?: string;
	namespace: {
		slug: string;
	};
};

export type LocalUserData = LocalUser | undefined;

export type LocationData = {
	pathname: string;
	query: {
		namespaceSlug?: string;
		collectionSlug?: string;
		mode?: string[];
		subMode?: string[];
		versionNumber?: string;
		redirect?: string;
	};
};

export type ProfilePageParams = {
	namespaceSlug: string;
	subMode?: string;
};

export type CollectionPageParams = {
	namespaceSlug: string;
	collectionSlug: string;
	mode?: string[];
	subMode?: string[];
};

export interface Entity {
	id: string;
	source?: string;
	target?: string;
	[prop: string]: any;
}

export type FieldType = "string" | "boolean" | "number";
export interface Field {
	id: string;
	namespace: string;
	type: FieldType;
	isRequired: boolean;
	allowMultiple: boolean;
}

export interface Node {
	id: string;
	namespace: string;
	fields: Field[];
}

export type Class = {
	id: string;
	key: string;
	isRelationship?: boolean;
	attributes: Attribute[];
};
export type Attribute = {
	id: string;
	key: string;
	type: string;
	isOptional: boolean;
	isUnique: boolean;
};
export type Schema = Class[];

export type Mapping = { class: string; attr: string; csvHeader: string }[];
