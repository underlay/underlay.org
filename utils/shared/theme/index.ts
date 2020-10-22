import { defaultTheme } from "evergreen-ui";
import getButtonClassName from "./getButtonClassName";

export const theme = {
	...defaultTheme,
	getButtonClassName,
	getAvatarProps: () => {
		return { color: "white", backgroundColor: "#D3C9BD" };
	},
};
