import React from 'react';
import { PageContext } from "utils/client/hooks";

const loggedIn = {
	sessionData: {
		user: {
			id: "1",
			name: "Test Person",
			email: "g@hi.com",
			slug: "test",
			avatar: "https://i.picsum.photos/id/92/300/300.jpg?hmac=wejPPm2iDwH8IF-wCg1XrQ5YocYqoNCFMjlLAfBSCU8" 
		},
		accessToken: "123abc",
		expires: new Date(),
	},
	locationData: {
		query: {
			profileSlug: 'fakeprofile',
			collectionSlug: 'fakecoll',
		},
		pathname: "/fakePath",
	}

};

export const LoggedInContext = (storyFn:any) => {
	return (
		<PageContext.Provider value={loggedIn}>
			{storyFn()}
		</PageContext.Provider>
	);
};
