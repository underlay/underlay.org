import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { IncomingMessage } from "http";

export type User = {
	id: string;
	name: string;
	email: string;
	slug: string;
	avatar: string;
};

export type InitData = {
	user: User;
	accessToken: string;
	expires: Date;
};

export const getInitData = async (req: IncomingMessage): Promise<InitData> => {
	const session = await getSession({ req });
	console.log(session);
	return session;
};

const route = async (req: NextApiRequest, res: NextApiResponse) => {
	const initData = await getInitData(req);
	res.status(200).json(initData);
};

export default route;
