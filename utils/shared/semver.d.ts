declare module "semver/functions/valid" {
	export default function (input: string): string | null;
}

declare module "semver/functions/inc" {
	export default function (
		input: string,
		release: "major" | "premajor" | "minor" | "preminor" | "patch" | "prepatch" | "prerelease"
	): string | null;
}

declare module "semver/functions/lt" {
	export default function (a: string, b: string): boolean;
}
