import React from "react";
import { ThemeProvider } from "evergreen-ui";

import { PageContext } from "utils/client/hooks";
import { theme } from "utils/shared/theme";
import { InitData } from "utils/server/initData";

const loggedIn: InitData = {
	session: {
		user: {
			id: "1",
			agentId: "1",
			name: "Test Person",
			email: "g@hi.com",
			slug: "test",
			avatar:
				"https://i.picsum.photos/id/92/300/300.jpg?hmac=wejPPm2iDwH8IF-wCg1XrQ5YocYqoNCFMjlLAfBSCU8",
		},
		accessToken: "123abc",
		expires: "someday",
	},
};

export const LoggedInContext = (storyFn: any) => {
	return <PageContext.Provider value={loggedIn}>{storyFn()}</PageContext.Provider>;
};

export const ThemedContext = (storyFn: any) => {
	return <ThemeProvider value={theme}>{storyFn()}</ThemeProvider>;
};
