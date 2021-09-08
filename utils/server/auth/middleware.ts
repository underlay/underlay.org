import nextConnect from "next-connect";

import { getLoginData } from "./user";

const auth = nextConnect().use(async (req, _res, next) => {
	//@ts-ignore
	req.user = await getLoginData(req);
	next();
});

export default auth;
