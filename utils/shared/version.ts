export function getNextVersion(ver: string) {
	let [major, minor, patch] = ver.split(".").map((s) => parseInt(s, 10));

	if (patch < 9) {
		patch++;
	} else {
		if (minor < 9) {
			minor++;
			patch = 0;
		} else {
			major++;
			minor = 0;
			patch = 0;
		}
	}

	return [major, minor, patch].join(".");
}
