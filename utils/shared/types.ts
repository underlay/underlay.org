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
		mode?: string;
		subMode?: string;
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
	subMode?: string;
};
