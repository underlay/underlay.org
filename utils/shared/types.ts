type LocalUser = {
	id: string;
	name: string;
	avatar?: string;
	slug: string;
};

export type LocalUserData = LocalUser | undefined;

export type LocationData = {
	profileSlug?: string;
	collectionSlug?: string;
	mode?: string;
	subMode?: string;
	versionNumber?: string;
};

export type ProfilePageParams = {
	profileSlug: string;
	subMode?: string;
};

export type CollectionPageParams = {
	profileSlug: string;
	collectionSlug: string;
	subMode?: string;
};
