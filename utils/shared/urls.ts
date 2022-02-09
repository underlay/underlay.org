type UrlFields = {
	namespaceSlug: string;
	collectionSlug?: string;
	mode?: string;
	subMode?: string;
};

export const buildUrl = ({ namespaceSlug, collectionSlug, mode, subMode }: UrlFields): string => {
	const profileString = namespaceSlug ? `/${namespaceSlug}` : "";
	const collectionString = collectionSlug ? `/${collectionSlug}` : "";
	const modeString = mode && mode !== "overview" ? `/${mode}` : "";
	const subModeString = subMode ? `/${subMode}` : "";
	return `${profileString}${collectionString}${modeString}${subModeString}`;
};
