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
}

export type ResourcePageParams = { id: string };