import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";
import { makeHandler } from "next-rest/server";

import semverValid from "semver/functions/valid";
import semverLt from "semver/functions/lt";

import prisma from "utils/server/prisma";
import { parseToml, toOption } from "utils/shared/schemas/parse";
import { catchPrismaError } from "utils/server/catchPrismaError";
import { slugPattern } from "utils/shared/slug";

const params = t.type({ id: t.string });

const patchRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const patchRequestBody = t.partial({
	description: t.string,
	slug: t.string,
	draftVersionNumber: t.string,
	draftContent: t.string,
	draftReadme: t.union([t.string, t.null]),
});

const postRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const postRequestBody = t.type({
	versionNumber: t.string,
	readme: t.union([t.null, t.string]),
	content: t.string,
});

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
						headers: { etag: string };
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
					throw StatusCodes.UNAUTHORIZED;
				}

				const schema = await prisma.schema.findOne({
					where: { id },
					select: { isPublic: true, agentId: true },
				});

				if (schema === null) {
					throw StatusCodes.NOT_FOUND;
				}

				if (schema.agentId !== session.user.agentId) {
					if (schema.isPublic) {
						throw StatusCodes.UNAUTHORIZED;
					} else {
						throw StatusCodes.NOT_FOUND;
					}
				}

				if (data.slug !== undefined) {
					if (!slugPattern.test(data.slug)) {
						throw StatusCodes.BAD_REQUEST;
					}
				}

				// Why not check if the slug is available first?
				// Because even if we do, it might still fail because someone
				// might have set that username in-between the check and the update.
				// Better to just handle the error where it happens, since we'll have to anyway.
				await prisma.schema.update({ where: { id }, data }).catch(catchPrismaError);
				return [{}, undefined];
			},
		},
		POST: {
			headers: postRequestHeaders.is,
			body: postRequestBody.is,
			exec: async (req, { id }, {}, { versionNumber, readme, content }) => {
				if (semverValid(versionNumber) === null) {
					throw StatusCodes.BAD_REQUEST;
				}

				const session = await getSession({ req });
				if (session === null) {
					throw StatusCodes.UNAUTHORIZED;
				}

				const schema = await prisma.schema.findOne({
					where: { id },
					include: { versions: { take: 1, orderBy: { createdAt: "desc" } } },
				});

				if (schema === null) {
					throw StatusCodes.NOT_FOUND;
				}

				// For now, users can only create versions for schemas that they created
				if (session.user.agentId !== schema.agentId) {
					if (schema.isPublic) {
						throw StatusCodes.UNAUTHORIZED;
					} else {
						throw StatusCodes.NOT_FOUND;
					}
				}

				if (schema.versions.length > 0) {
					const [lastVersion] = schema.versions;
					if (semverValid(lastVersion.versionNumber) !== null) {
						if (!semverLt(lastVersion.versionNumber, versionNumber)) {
							throw StatusCodes.CONFLICT;
						}
					}
				}

				const result = toOption(parseToml(content));
				if (result._tag === "None") {
					throw StatusCodes.BAD_REQUEST;
				}

				const {
					versions: [{ id: etag }],
				} = await prisma.schema
					.update({
						include: { versions: { take: 1, orderBy: { createdAt: "desc" } } },
						where: { id },
						data: {
							draftVersionNumber: versionNumber,
							draftContent: content,
							draftReadme: readme,
							versions: {
								create: {
									agent: { connect: { id: session.user.agentId } },
									versionNumber,
									readme,
									content,
								},
							},
						},
					})
					.catch(catchPrismaError);

				return [{ etag }, undefined];
			},
		},
	},
});
