import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";
import { isLeft } from "fp-ts/lib/Either.js";

import { makeHandler, ApiError } from "next-rest/server";

import { encode } from "@underlay/apg-format-binary";
import schemaSchema, { fromSchema } from "@underlay/apg-schema-schema";

import { prisma, selectAgentProps } from "utils/server/prisma";
import { parseSchema } from "utils/server/parseSchema";
import { catchPrismaError } from "utils/server/catchPrismaError";
import { slugPattern } from "utils/shared/slug";
import { getSession } from "next-auth/client";
import { getVersionNumber } from "utils/server/version";

import { buildUrl } from "utils/shared/urls";
import { checkSlugUniqueness } from "utils/server/resource";
import { getProfileSlug } from "utils/shared/propTypes";

const params = t.type({ id: t.string });

const patchRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const patchRequestBody = t.partial({
	description: t.string,
	slug: t.string,
	content: t.string,
	readme: t.string,
});

const postRequestHeaders = t.type({});
const postRequestBody = t.void;

declare module "next-rest" {
	interface API {
		"/api/schema/[id]": Route<{
			params: t.TypeOf<typeof params>;
			methods: {
				PATCH: {
					request: {
						headers: t.TypeOf<typeof patchRequestHeaders>;
						body: t.TypeOf<typeof patchRequestBody>;
					};
					response: {
						headers: {};
						body: void;
					};
				};
				POST: {
					request: {
						headers: t.TypeOf<typeof postRequestHeaders>;
						body: t.TypeOf<typeof postRequestBody>;
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

export default makeHandler<"/api/schema/[id]">({
	params: params.is,
	methods: {
		PATCH: {
			headers: patchRequestHeaders.is,
			body: patchRequestBody.is,
			exec: async (req, { id }, {}, data) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				if (data.slug !== undefined) {
					if (!slugPattern.test(data.slug)) {
						throw new ApiError(StatusCodes.BAD_REQUEST);
					}
					await checkSlugUniqueness({ userId: session.user.id }, data.slug);
				}

				const { count } = await prisma.schema
					.updateMany({ where: { id, agent: { userId: session.user.id } }, data })
					.catch(catchPrismaError);

				if (count === 0) {
					throw new ApiError(StatusCodes.NOT_FOUND);
				} else if (count > 1) {
					throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR);
				}

				return [{}, undefined];
			},
		},
		POST: {
			headers: postRequestHeaders.is,
			body: postRequestBody.is,
			exec: async (req, { id }) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				const schema = await prisma.schema.findFirst({
					where: { id, agent: { userId: session.user.id } },
					select: {
						agent: { select: selectAgentProps },
						slug: true,
						content: true,
						readme: true,
						lastVersion: {
							select: { id: true, versionNumber: true, schemaInstance: true },
						},
					},
				});

				if (schema === null) {
					throw new ApiError(StatusCodes.NOT_FOUND);
				}

				const result = parseSchema(schema.content);
				if (isLeft(result)) {
					throw new ApiError(StatusCodes.BAD_REQUEST);
				}

				const schemaInstance = encode(schemaSchema, fromSchema(result.right.schema));

				const versionNumber = getVersionNumber(schema.lastVersion, result.right.schema);

				const schemaVersion = await prisma.schemaVersion.create({
					select: { id: true },
					data: {
						schema: { connect: { id } },
						user: { connect: { id: session.user.id } },
						previousVersion:
							schema.lastVersion === null
								? undefined
								: { connect: { id: schema.lastVersion.id } },
						isLastVersion: { connect: { id } },
						versionNumber,
						content: schema.content,
						readme: schema.readme,
						schemaInstance,
					},
				});

				const etag = `"${schemaVersion.id}"`;

				const profileSlug = getProfileSlug(schema.agent);
				const location = buildUrl({ profileSlug, contentSlug: schema.slug, versionNumber });

				return [{ etag, location }, undefined];
			},
		},
	},
});
