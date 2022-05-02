export function updateArrayWithNewElement<T>(arr: T[], position: number, newEl: T) {
	return arr.map((el, i) => {
		if (i === position) {
			return newEl;
		}
		return el;
	});
}

export function pushToArrayIfUnseen<T>(arr: T[], newEl: T) {
	if (arr.includes(newEl)) {
		return arr;
	}

	return [...arr, newEl];
}

export function zip<T, U>(as: T[], bs: U[]) {
	return as.map((a, i) => {
		return [a, bs[i]];
	});
}
