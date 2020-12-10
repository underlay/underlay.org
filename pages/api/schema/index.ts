import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";

import { makeHandler } from "next-rest/server";
import { catchPrismaError } from "utils/server/catchPrismaError";

import { prisma } from "utils/server/prisma";
import { initialSchemaContent } from "utils/shared/schemas/initialContent";

const validateParams = t.type({});
const requestHeaders = t.type({ "content-type": t.literal("application/json") });

const requestBody = t.type({
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
				if (session === null) {
					throw StatusCodes.UNAUTHORIZED;
				}

				const { slug, description, isPublic } = body;

				const draftContent = initialSchemaContent;
				const draftReadme = `# ${slug}\n\n> ${description}`;
				const draftVersionNumber = "0.0.0";

				// For now, we just create a schema that is linked to
				// the session user as the agent.
				const schema = await prisma.schema
					.create({
						data: {
							agent: { connect: { userId: session.user.id } },
							slug,
							description,
							isPublic,
							draftContent,
							draftReadme,
							draftVersionNumber,
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
