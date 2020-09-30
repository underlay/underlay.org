type urlInputs = {
	namespaceSlug?: string;
	packageSlug?: string;
	mode?: string;
	subMode?: string;
};

export const buildUrl = ({ namespaceSlug, packageSlug, mode, subMode }: urlInputs): string => {
	const namespaceString = namespaceSlug ? `/${namespaceSlug}` : "";
	const packageString = packageSlug ? `/${packageSlug}` : "";
	const modeString = mode ? `/${mode}` : "";
	const subModeString = subMode ? `/${subMode}` : "";
	return `${namespaceString}${packageString}${modeString}${subModeString}`;
};
