type urlInputs = {
	profileSlug?: string;
	contentSlug?: string;
	mode?: string;
	subMode?: string;
	type?: "schema" | "collection";
};

export const buildUrl = ({ profileSlug, contentSlug, mode, subMode, type }: urlInputs): string => {
	const profileString = profileSlug ? `/${profileSlug}` : "";
	const contentString = contentSlug ? `/${contentSlug}` : "";
	const modeString = mode ? `/${mode}` : "";
	const subModeString = subMode ? `/${subMode}` : "";
	const typeString = type ? `/${type}s` : "";
	return `${profileString}${typeString}${contentString}${modeString}${subModeString}`;
};
