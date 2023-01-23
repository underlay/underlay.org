import { Version } from "@prisma/client";

// export function getNextVersion(ver: string | undefined | null) {
// 	if (!ver || ver === "") {
// 		return "0.0.1";
// 	}

// 	let [major, minor, patch] = ver.split(".").map((s) => parseInt(s, 10));

// 	if (patch < 9) {
// 		patch++;
// 	} else {
// 		if (minor < 9) {
// 			minor++;
// 			patch = 0;
// 		} else {
// 			major++;
// 			minor = 0;
// 			patch = 0;
// 		}
// 	}

// 	return [major, minor, patch].join(".");
// }

export const getMaxVersionNumber = (versions: Version[]) => {
	return versions.reduce((prev, curr) => {
		return getLargerVersion(curr.number, prev);
	}, "0.0.0");
};

export const getPatchIncrement = (currentVersion: string) => {
	const [major, minor, patch] = currentVersion.split(".");
	return `${major}.${minor}.${Number(patch) + 1}`;
};
export const getMinorIncrement = (currentVersion: string) => {
	const [major, minor] = currentVersion.split(".");
	return `${major}.${Number(minor) + 1}`;
};

export const getMajorIncrement = (currentVersion: string) => {
	const [major] = currentVersion.split(".");
	return `${Number(major) + 1}.0`;
};

export const isSameMinorVersion = (foo: string, bar: string) => {
	const [fooMajor, fooMinor] = foo.split(".");
	const [barMajor, barMinor] = bar.split(".");
	return fooMajor === barMajor && fooMinor === barMinor;
};

export const isSameMajorVersion = (foo: string, bar: string) => {
	const [fooMajor] = foo.split(".");
	const [barMajor] = bar.split(".");
	return fooMajor === barMajor;
};
export const getLargerVersion = (foo: string, bar: string) => {
	const [fooMajor, fooMinor, fooPatch] = foo.split(".");
	const [barMajor, barMinor, barPatch] = bar.split(".");
	if (Number(fooMajor) > Number(barMajor)) {
		return foo;
	}
	if (Number(fooMajor) < Number(barMajor)) {
		return bar;
	}
	if (Number(fooMinor) > Number(barMinor)) {
		return foo;
	}
	if (Number(fooMinor) < Number(barMinor)) {
		return bar;
	}
	if (Number(fooPatch) > Number(barPatch)) {
		return foo;
	}
	if (Number(fooPatch) < Number(barPatch)) {
		return bar;
	}
	return foo;
};

export const versionSorter = (foo: string, bar: string) => {
	if (foo === bar) {
		return 0;
	}

	if (getLargerVersion(foo, bar) === foo) {
		return 1;
	} else {
		return -1;
	}
};
