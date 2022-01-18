export function updateArrayWithNewElement<T>(arr: T[], position: number, newEl: T) {
	return arr.map((el, i) => {
		if (i === position) {
			return newEl;
		}
		return el;
	});
}
