type urlInputs = {
	profileSlug?: string;
	collectionSlug?: string;
	mode?: string;
	subMode?: string;
};

export const buildUrl = ({ profileSlug, collectionSlug, mode, subMode }: urlInputs): string => {
	const profileString = profileSlug ? `/${profileSlug}` : "";
	const collectionString = collectionSlug ? `/${collectionSlug}` : "";
	const modeString = mode ? `/${mode}` : "";
	const subModeString = subMode ? `/${subMode}` : "";
	return `${profileString}${collectionString}${modeString}${subModeString}`;
};
