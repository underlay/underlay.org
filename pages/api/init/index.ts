import { NextApiRequest, NextApiResponse } from "next";
// import { getSession } from "next-auth/client";
// import { IncomingMessage } from "http";

// export type User = {
// 	id: string;
// 	name: string;
// 	email: string;
// 	slug: string;
// 	avatar: string;
// };

// export type InitData = {
// 	user?: User;
// 	accessToken?: string;
// 	expires?: Date;
// };

// /*
// getInitData is called by either getInitialProps in app.tsx (i.e. each page load)
// or on api calls that need user account info. The former
// */
// export const getInitData = async (req: IncomingMessage | undefined): Promise<InitData> => {
// 	const session = await getSession({ req });
// 	const initData = {
// 		user: session?.user,
// 		accessToken: session?.accessToken,
// 		expires: session?.expires,
// 	};
// 	// next-auth Session value does not update to reflect the different session
// 	// callback we provide in [...nextauth].js
// 	// @ts-ignore
// 	return initData;
// };

/* DEPRECATED: We can delete this file once we have other api files showing boilerplate */
const route = async (req: NextApiRequest, res: NextApiResponse) => {
	const initData = { req, res };
	res.status(200).json(initData);
};

export default route;
