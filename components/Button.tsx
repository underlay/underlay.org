import React from "react";
import AtlasButton, { ButtonProps, Theme } from "@atlaskit/button";

const customTheme = (currentTheme: any, themeProps: any) => {
	const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
	return {
		buttonStyles: {
			...buttonStyles,
		},
		spinnerStyles,
	};
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
	return (
		<Theme.Provider value={customTheme}>
			<AtlasButton {...props} />
		</Theme.Provider>
	);
};

export default Button;
