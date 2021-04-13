import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";

import { makeHandler, ApiError } from "next-rest/server";
import { catchPrismaError } from "utils/server/catchPrismaError";

import { prisma } from "utils/server/prisma";
import { checkSlugUniqueness } from "utils/server/resource";
import { emptyGraph } from "utils/shared/pipeline";

const validateParams = t.type({});
const requestHeaders = t.type({ "content-type": t.literal("application/json") });

const requestBody = t.type({
	slug: t.string,
	description: t.string,
	isPublic: t.boolean,
});

declare module "next-rest" {
	interface API {
		"/api/pipeline": Route<{
			params: {};
			methods: {
				POST: {
					request: {
						headers: t.TypeOf<typeof requestHeaders>;
						body: t.TypeOf<typeof requestBody>;
					};
					response: {
						headers: { etag: string };
						body: void;
					};
				};
			};
		}>;
	}
}

export default makeHandler<"/api/pipeline">({
	params: validateParams.is,
	methods: {
		POST: {
			headers: requestHeaders.is,
			body: requestBody.is,
			exec: async (req, {}, {}, body) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				const { slug, description, isPublic } = body;

				await checkSlugUniqueness({ userId: session.user.id }, slug);

				const agent = { connect: { userId: session.user.id } };
				const data = { agent, slug, description, isPublic, graph: emptyGraph };
				const pipeline = await prisma.pipeline.create({ data }).catch(catchPrismaError);

				return [{ etag: pipeline.id }, undefined];
			},
		},
	},
});
