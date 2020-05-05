export const timeAgoBaseProps = {
	minPeriod: 60,
	formatter: (value, unit, suffix) => {
		if (unit === 'second') {
			return 'just now';
		}
		let newUnit = unit;
		if (value > 1) {
			newUnit += 's';
		}
		return `${value} ${newUnit} ${suffix}`;
	},
};
