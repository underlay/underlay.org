import React from 'react';
import { PageContext } from "utils/client/hooks";

const loggedIn = {
	user: {
		id: "1",
		name: "Test Person",
		email: "g@hi.com",
		slug: "test",
		avatar: "" 
	},
	accessToken: "123abc",
	expires: new Date(),
};

export const LoggedInContext = (storyFn:any) => {
	return (
		<PageContext.Provider value={loggedIn}>
			{storyFn()}
		</PageContext.Provider>
	);
};
