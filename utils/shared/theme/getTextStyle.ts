/* Copied from https://github.com/segmentio/evergreen/blob/master/src/theme/src/default-theme/theme-helpers/index.js */
/* Orignal values are left as comments next to their overwritten value */

const textStyles: Record<string, Record<string, string | number>> = {
	"600": {
		fontSize: "22px",
		fontWeight: 400,
		lineHeight: "22px",
		letterSpacing: "-0.07px",
		marginTop: 30,
	},
	"500": {
		fontSize: "18px",
		fontWeight: 400,
		lineHeight: "22px",
		letterSpacing: "-0.05px",
		marginTop: 18,
	},
	"400": {
		// Default
		fontSize: "16px",
		fontWeight: 400,
		lineHeight: "20px",
		letterSpacing: "-0.05px",
		marginTop: 14,
	},
	"300": {
		fontSize: "14px",
		fontWeight: 400,
		lineHeight: "18px",
		letterSpacing: "0",
		marginTop: 14,
	},
};

const getTextStyle = (size: number) => textStyles[size.toString()];

export default getTextStyle;
