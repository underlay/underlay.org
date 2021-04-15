import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { makeHandler, ApiError } from "next-rest/server";
import { getSession } from "next-auth/client";

import { encode } from "@underlay/apg-format-binary";
import schemaSchema, { fromSchema } from "@underlay/apg-schema-schema";

import { prisma, selectAgentProps } from "utils/server/prisma";

import { slugPattern } from "utils/shared/slug";

import { checkSlugUniqueness } from "utils/server/resource";
import { getVersionNumber } from "utils/server/version";
import { buildUrl } from "utils/shared/urls";
import { getProfileSlug } from "utils/shared/propTypes";
import { resolveSchema } from "utils/server/resolve";
import { catchPrismaError } from "utils/server/catchPrismaError";

const params = t.intersection([
	t.type({ id: t.string }),
	t.partial({ key: t.string, token: t.string }),
]);

const patchRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const patchRequestBody = t.partial({
	description: t.string,
	slug: t.string,
});

const postRequestHeaders = t.intersection([
	t.partial({ "if-match": t.string }),
	t.type({
		"content-type": t.literal("text/markdown"),
		"x-collection-schema": t.string,
		"x-collection-instance": t.string,
	}),
]);

const postRequestBody = t.string;

declare module "next-rest" {
	interface API {
		"/api/collection/[id]": Route<{
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
						headers: { location: string; etag: string };
						body: void;
					};
				};
			};
		}>;
	}
}

export default makeHandler<"/api/collection/[id]">({
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
						throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid name");
					}
					await checkSlugUniqueness({ userId: session.user.id }, data.slug);
				}

				const { count } = await prisma.collection
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
			exec: async ({}, { id, key, token }, headers, body) => {
				const {
					// "if-match": ifMatch,
					"x-collection-schema": schemaURI,
					"x-collection-instance": instanceURI,
				} = headers;

				if (key === undefined || token === undefined) {
					throw new ApiError(StatusCodes.BAD_REQUEST);
				}

				const execution = await prisma.execution.findUnique({
					where: { id: key },
					select: { token: true, successful: true, userId: true },
				});

				if (
					execution === null ||
					execution.successful !== null ||
					execution.token !== token
				) {
					throw new ApiError(StatusCodes.BAD_REQUEST);
				}

				const schema = await resolveSchema(schemaURI);

				const collection = await prisma.collection.findUnique({
					where: { id },
					select: {
						agent: { select: selectAgentProps },
						slug: true,
						lastVersion: {
							select: { id: true, versionNumber: true, schemaInstance: true },
						},
					},
				});

				if (collection === null) {
					throw new ApiError(StatusCodes.NOT_FOUND);
				}

				// // TODO: Uncomment this after etags are implemented in CollectionTargets.tsx
				// if (collection.lastVersion !== null) {
				// 	const etag = `"${collection.lastVersion.id}"`;
				// 	if (ifMatch === undefined) {
				// 		throw new ApiError(StatusCodes.PRECONDITION_REQUIRED);
				// 	} else if (ifMatch !== etag) {
				// 		throw new ApiError(StatusCodes.PRECONDITION_FAILED);
				// 	}
				// } else if (ifMatch !== undefined) {
				// 	throw new ApiError(StatusCodes.PRECONDITION_FAILED);
				// }

				const versionNumber = getVersionNumber(collection.lastVersion, schema);

				const collectionVersion = await prisma.collectionVersion
					.create({
						select: { id: true },
						data: {
							collection: { connect: { id } },
							execution: { connect: { id: key } },
							user: { connect: { id: execution.userId } },
							previousVersion:
								collection.lastVersion === null
									? undefined
									: { connect: { id: collection.lastVersion.id } },
							isLastVersion: { connect: { id } },
							versionNumber,
							schemaInstance: encode(schemaSchema, fromSchema(schema)),
							schemaURI: schemaURI,
							instanceURI: instanceURI,
							readme: body,
						},
					})
					.catch(catchPrismaError);

				const etag = `"${collectionVersion.id}"`;

				const profileSlug = getProfileSlug(collection.agent);
				const location = buildUrl({
					profileSlug,
					contentSlug: collection.slug,
					versionNumber,
				});

				return [{ etag, location }, undefined];
			},
		},
	},
});
