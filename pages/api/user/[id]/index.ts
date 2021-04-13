import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";

import { makeHandler, ApiError } from "next-rest/server";

import { slugPattern } from "utils/shared/slug";
import { catchPrismaError } from "utils/server/catchPrismaError";

import { prisma } from "utils/server/prisma";

const params = t.type({ id: t.string });
const headers = t.type({ "content-type": t.literal("application/json") });
const body = t.partial({
	name: t.string,
	slug: t.string,
});

declare module "next-rest" {
	interface API {
		"/api/user/[id]": Route<{
			params: t.TypeOf<typeof params>;
			methods: {
				PATCH: {
					request: {
						headers: t.TypeOf<typeof headers>;
						body: t.TypeOf<typeof body>;
					};
					response: {
						headers: {};
						body: void;
					};
				};
			};
		}>;
	}
}

export default makeHandler<"/api/user/[id]">({
	params: params.is,
	methods: {
		PATCH: {
			headers: headers.is,
			body: body.is,
			exec: async (req, { id }, {}, data) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				} else if (session.user.id !== id) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				if (data.slug !== undefined) {
					if (!slugPattern.test(data.slug)) {
						throw new ApiError(StatusCodes.BAD_REQUEST);
					}
				}

				// Why not check if the slug is available first?
				// Because even if we do, it might still fail because someone
				// might have set that username in-between the check and the update.
				// Better to just handle the error where it happens.
				// A better end-user solution would be to implement a "check username available" API
				// and integrate that into the UI with some debounce and a spinner (GitHub does this)
				await prisma.user.update({ where: { id }, data }).catch(catchPrismaError);
				return [{}, undefined];
			},
		},
	},
});
