import crypto from "crypto";
import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";
import { nanoid } from "nanoid";

import { getSession } from "next-auth/client";
import { makeHandler, ApiError } from "next-rest/server";
import { bucket, region, request, service } from "utils/server/s3";

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

interface Policy {
	expiration: string;
	conditions: Array<Record<string, string> | string[]>;
}

const params = t.type({ id: t.string, filename: t.string });
const headers = t.type({});
const body = t.void;

declare module "next-rest" {
	interface API {
		"/api/user/[id]/upload/[filename]": Route<{
			params: t.TypeOf<typeof params>;
			methods: {
				GET: {
					request: {
						headers: t.TypeOf<typeof headers>;
						body: t.TypeOf<typeof body>;
					};
					response: {
						headers: { "content-type": "application/json" };
						body: {
							key: string;
							bucket: string;
							credential: string;
							policy: Policy;
							signature: string;
							date: string;
						};
					};
				};
			};
		}>;
	}
}

// https://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html

const hmac = (key: string | Buffer, data: string): Buffer =>
	crypto.createHmac("sha256", key).update(data, "utf8").digest();

function sign(policy: Policy, date: string) {
	if (secretKey === undefined || accessKey === undefined) {
		throw new Error("AWS keys not found");
	}

	const dateKey = hmac("AWS4" + secretKey, date);
	const regionKey = hmac(dateKey, region);
	const serviceKey = hmac(regionKey, service);
	const signingKey = hmac(serviceKey, request);

	const data = Buffer.from(JSON.stringify(policy)).toString("base64");
	return hmac(signingKey, data).toString("hex");
}

export default makeHandler<"/api/user/[id]/upload/[filename]">({
	params: params.is,
	methods: {
		GET: {
			headers: headers.is,
			body: body.is,
			exec: async (req, { id, filename }, {}) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				} else if (session.user.id !== id) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				const dateTime = new Date();
				const expiration = new Date(dateTime.valueOf() + 600000).toISOString();

				const dateTimeString = dateTime.toISOString();
				const dateString = dateTimeString.slice(0, dateTimeString.indexOf("T"));
				const date = dateString.split("-").join("");

				const key = `uploads/${id}/${nanoid(10)}/${filename}`;
				const credential = `${accessKey}/${date}/${region}/${service}/${request}`;

				const policy: Policy = {
					expiration,
					conditions: [
						{ bucket: bucket },
						{ key: key },
						{ acl: "private" },
						{ success_action_status: "200" },
						["starts-with", "$Content-Type", ""],
						{ "X-Amz-Algorithm": "AWS4-HMAC-SHA256" },
						{ "X-Amz-Credential": credential },
						{ "X-Amz-Date": `${date}T000000Z` },
					],
				};

				const signature = sign(policy, date);
				return [
					{ "content-type": "application/json" },
					{ key, bucket, policy, credential, signature, date },
				];
			},
		},
	},
});
