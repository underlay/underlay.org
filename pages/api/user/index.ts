import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import prisma from "prisma/db";

// import { generateRandomString, slugifyString } from "utils/shared/strings";
import { getLoginId } from "utils/server/auth/user";

export default nextConnect<NextApiRequest, NextApiResponse>()
  .put(async (req, res) => {
  	const loginId = await getLoginId(req);
  	if (!loginId) {
  		return res.status(403).json({ ok: false });
  	}

  	const { id, name, about, nameSlug, avatar } = req.body;

  	await prisma.user.update({
  		where: {
  			id,
  		},
  		data: {
  			name,
  			about,
  			avatar,
  			namespace: {
  				update: {
  					slug: nameSlug,
  				},
  			},
  		},
  	});

  	return res.status(200).json({ ok: true });
  })
