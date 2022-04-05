/**
 * Convert date to format like `Mar 22, 2022`
 */
export function convertToLocaleDateString(date: Date) {
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}
