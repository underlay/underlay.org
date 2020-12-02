import { SchemaProps } from "utils/shared/propTypes";

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
		query.push(`subMode=${subMode}`);
	}

	if (query.length > 0) {
		return `/${components.join("/")}?${query.join("&")}`;
	} else {
		return `/${components.join("/")}`;
	}
};

export const getResourceLocation = ({
	slug,
	agent: { user, organization },
}: Omit<SchemaProps, "createdAt">): LocationData => ({
	profileSlug: user?.slug || organization?.slug || undefined,
	contentSlug: slug || undefined,
});
