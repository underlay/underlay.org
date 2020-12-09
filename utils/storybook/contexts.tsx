import React from "react";
import { ThemeProvider } from "evergreen-ui";

import { PageContext } from "utils/client/hooks";
import { theme } from "utils/shared/theme";

import { RouterContext as RC } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/dist/next-server/lib/router/router";

import { PageData } from "utils/shared/session";

const loggedIn: PageData = {
	isStatic: false,
	session: {
		user: {
			id: "1",
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

const router: NextRouter = {
	route: "",
	pathname: "",
	query: {},
	asPath: "",
	basePath: "",
	push: async () => true,
	replace: async () => true,
	reload: () => null,
	back: () => null,
	prefetch: async () => undefined,
	beforePopState: () => null,
	isFallback: false,
	events: {
		on: () => null,
		off: () => null,
		emit: () => null,
	},
};

export const RouterContext = (storyFn: any) => {
	return <RC.Provider value={router}>{storyFn()}</RC.Provider>;
};
