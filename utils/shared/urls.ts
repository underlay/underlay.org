export interface LocationData {
	profileSlug?: string;
	contentSlug?: string;
	versionNumber?: string;
	mode?: string;
	subMode?: string;
}

export const buildUrl = ({
	profileSlug,
	contentSlug,
	versionNumber,
	mode,
	subMode,
}: LocationData): string => {
	const components: string[] = [];
	if (profileSlug) {
		components.push(profileSlug);
	}
	if (contentSlug) {
		components.push(contentSlug);
	}
	if (versionNumber) {
		components.push(versionNumber);
	}

	const query: string[] = [];
	if (mode) {
		query.push(`mode=${mode}`);
	}
	if (subMode) {
		query.push(`submode=${subMode}`);
	}

	if (query.length > 0) {
		return `/${components.join("/")}?${query.join("&")}`;
	} else {
		return `/${components.join("/")}`;
	}
};
