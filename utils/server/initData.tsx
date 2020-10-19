import { getSession } from "next-auth/client";
import { NextPageContext } from "next";

export type User = {
	id: string;
	name: string;
	email: string;
	slug: string;
	avatar: string;
};

export type InitData = {
	sessionData: {
		user?: User;
		accessToken?: string;
		expires?: Date;
	};
	locationData: {
		query: {
			profileSlug?: string;
			collectionSlug?: string;
		};
		pathname?: string;
	};
};

export const getInitData = async (ctx: NextPageContext): Promise<InitData> => {
	const sessionData = await getSession({ req: ctx.req });
	const locationData = {
		query: ctx.query,
		pathname: ctx.pathname,
	};
	// next-auth Session value does not update to reflect the different session
	// callback we provide in [...nextauth].js
	// @ts-ignore
	return { sessionData, locationData };
};
