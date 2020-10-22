import { LoggedInContext, ThemedContext } from "utils/storybook/contexts";
import "pages/app.scss";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
	options: {
		showPanel: false,
	},
};

export const decorators = [ThemedContext, LoggedInContext];
