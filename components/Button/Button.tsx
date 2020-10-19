import React from "react";
import { CustomThemeButton, ButtonProps } from "@atlaskit/button";

const customTheme = (currentTheme: any, themeProps: any) => {
	const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
	return {
		buttonStyles: {
			...buttonStyles,
			color: "#182026",
			fontWeight: "400",
		},
		spinnerStyles,
	};
};

const Button: React.FC<ButtonProps> = (props) => {
	return (
		<CustomThemeButton {...props} theme={customTheme} />
	);
};

export default Button;
