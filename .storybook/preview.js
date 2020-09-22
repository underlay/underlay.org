import { LoggedInContext } from "utils/storybook/contexts";
import "pages/app.scss";

export const parameters = {
	actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [LoggedInContext];
