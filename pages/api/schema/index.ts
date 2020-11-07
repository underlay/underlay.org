import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";

import { makeHandler } from "next-rest/server";
import { catchPrismaError } from "utils/server/catchPrismaError";

import prisma from "utils/server/prisma";

const validateParams = t.type({});
const requestHeaders = t.type({ "content-type": t.literal("application/json") });
const requestBody = t.type({
	agentId: t.string,
	slug: t.string,
	description: t.string,
	isPublic: t.boolean,
});

declare module "next-rest" {
	interface API {
		"/api/schema": Route<{
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

export default makeHandler<"/api/schema">({
	params: validateParams.is,
	methods: {
		POST: {
			headers: requestHeaders.is,
			body: requestBody.is,
			exec: async (req, {}, {}, body) => {
				const session = await getSession({ req });
				if (session === null || session.user.agentId === null) {
					throw StatusCodes.UNAUTHORIZED;
				}

				const { agentId, slug, description, isPublic } = body;

				// For now, users are only allowed to create schemas on behalf of themselves
				if (session.user.agentId !== agentId) {
					throw StatusCodes.UNAUTHORIZED;
				}

				const schema = await prisma.schema
					.create({
						data: {
							agent: { connect: { id: agentId } },
							slug,
							description,
							isPublic,
						},
					})
					.catch(catchPrismaError);

				if (schema === null) {
					throw StatusCodes.INTERNAL_SERVER_ERROR;
				}

				return [{ etag: schema.id }, undefined];
			},
		},
	},
});
