import { getSession } from "next-auth/client";
import { NextPageContext } from "next";

import { Session } from "utils/shared/session";

export type InitData = {
	session: Session | null;
};

export const getInitData = async (ctx: NextPageContext): Promise<InitData> => {
	const session = await getSession({ req: ctx.req });

	// next-auth Session value does not update to reflect the different session
	// callback we provide in [...nextauth].js
	// @ts-ignore
	return { session };
};
