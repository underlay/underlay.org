export type LoginData =
	| undefined
	| {
			id: string;
			slug: string;
			email: string;
			name?: string;
			avatar?: string;
			signupCompletedAt?: Date;
			createdAt: Date;
			updatedAt: Date;
	  };

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
