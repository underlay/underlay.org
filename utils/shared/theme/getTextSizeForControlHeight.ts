/* Copied from https://github.com/segmentio/evergreen/blob/master/src/theme/src/default-theme/theme-helpers/index.js */
/* Orignal values are left as comments next to their overwritten value */

const getTextSizeForControlHeight = (height: number) => {
	if (height <= 24) return 300;
	if (height <= 28) return 300;
	if (height <= 32) return 300;
	if (height <= 36) return 400;
	if (height <= 40) return 400;
	return 500;
};

export default getTextSizeForControlHeight;