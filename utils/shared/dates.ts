/**
 * Convert date to format like `Mar 22, 2022`
 */
export function convertToLocaleDateString(date: Date) {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

/**
 * Convert date to format like `Mar 22, 2022, 9:00:00 AM`
 */
export function convertToLocaleTimeString(date: Date) {
	return new Date(date).toLocaleTimeString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
