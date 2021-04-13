import type { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "next-auth/client";
import { StatusCodes } from "http-status-codes";
import { Readable } from "stream";

import { GetObjectCommand } from "@aws-sdk/client-s3";

import * as t from "io-ts";

import { S3 } from "utils/server/s3";

const params = t.type({ key: t.string, bucket: t.string });

const keyPattern = /^uploads\/([a-zA-Z0-9-]+)\/([a-zA-Z0-9-_]+)\//;

export default async function (req: NextApiRequest, res: NextApiResponse) {
	const session = await getSession({ req });
	if (session === null) {
		return res.status(StatusCodes.FORBIDDEN).end();
	} else if (!params.is(req.query)) {
		return res.status(StatusCodes.BAD_REQUEST).end();
	}

	const { key, bucket } = req.query;

	const match = keyPattern.exec(key);

	if (match === null) {
		return res.status(StatusCodes.NOT_FOUND).end();
	}

	const [_, id] = match;

	if (id !== session.user.id) {
		return res.status(StatusCodes.FORBIDDEN).end();
	}

	const command = new GetObjectCommand({ Bucket: bucket, Key: key });

	await S3.send(command).then(
		({ Body }) => {
			if (Body instanceof Readable) {
				res.status(200);
				Body.pipe(res);
			} else {
				res.status(502).end();
			}
		},
		(err) => {
			res.status(502).end(err.toString());
		}
	);
}
