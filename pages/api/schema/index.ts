import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";
import { makeHandler, ApiError } from "next-rest/server";
import { catchPrismaError } from "utils/server/catchPrismaError";

import { prisma, selectAgentProps } from "utils/server/prisma";
import { checkSlugUniqueness } from "utils/server/resource";
import { getProfileSlug } from "utils/shared/propTypes";
import { initialSchemaContent } from "utils/server/initialSchemaContent";
import { buildUrl } from "utils/shared/urls";

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
						headers: { etag: string; location: string };
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
			exec: async (req, {}, {}, { slug, description, isPublic }) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				await checkSlugUniqueness({ userId: session.user.id }, slug);

				const initialReadme = `# ${slug}\n\n> ${description}`;

				const schema = await prisma.schema
					.create({
						select: { agent: { select: selectAgentProps }, id: true },
						data: {
							agent: { connect: { userId: session.user.id } },
							slug,
							description,
							isPublic,
							content: initialSchemaContent,
							readme: initialReadme,
						},
					})
					.catch(catchPrismaError);

				const etag = `"${schema.id}"`;

				const profileSlug = getProfileSlug(schema.agent);
				const location = buildUrl({ profileSlug, contentSlug: slug });

				return [{ etag, location }, undefined];
			},
		},
	},
});
