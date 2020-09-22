import React from "react";
import AtlasButton from "@atlaskit/button";

const customTheme = (currentTheme, themeProps) => {
	const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
	return {
		buttonStyles: {
			...buttonStyles,
		},
		spinnerStyles,
	};
};
const Button = (props) => <AtlasButton {...props} theme={customTheme} />;

export default Button;
