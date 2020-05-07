export const buildUrl = ({ namespaceSlug, packageSlug, mode, subMode }) => {
	const namespaceString = namespaceSlug ? `/${namespaceSlug}` : '';
	const packageString = packageSlug ? `/${packageSlug}` : '';
	const modeString = mode ? `/${mode}` : '';
	const subModeString = subMode ? `/${subMode}` : '';
	return `${namespaceString}${packageString}${modeString}${subModeString}`;
};
