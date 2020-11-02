import { getSession } from "next-auth/client";
import { NextPageContext } from "next";

import { Session } from "utils/shared/session";

export type InitData = {
	sessionData: Session;
};

export const getInitData = async (ctx: NextPageContext): Promise<InitData> => {
	const sessionData = await getSession({ req: ctx.req });

	// next-auth Session value does not update to reflect the different session
	// callback we provide in [...nextauth].js
	// @ts-ignore
	return { sessionData };
};
