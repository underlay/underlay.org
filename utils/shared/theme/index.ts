import { defaultTheme } from "evergreen-ui";

import getButtonClassName from "./getButtonClassName";
import getTabClassName from "./getTabClassName";
import getTextSizeForControlHeight from "./getTextSizeForControlHeight";
import getTextStyle from './getTextStyle';

const defaultFonts = "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, Icons16, sans-serif";
/* These direct overwrites are made because of this Issue reply that */
/* suggests this is the only direct way of theming at the moment:  */
/* https://github.com/segmentio/evergreen/issues/542#issuecomment-673617651 */
defaultTheme.colors.text.default = "#333";
defaultTheme.typography.fontFamilies.display =defaultFonts;
defaultTheme.typography.fontFamilies.ui = defaultFonts;

export const theme = {
	...defaultTheme,
	getButtonClassName,
	getTabClassName,
	getTextSizeForControlHeight,
	getTextStyle,
	getAvatarProps: () => {
		return { color: "white", backgroundColor: "#D3C9BD" };
	},
};

console.log(theme);