import { StatusCodes } from "http-status-codes";

import * as t from "io-ts";

import { getSession } from "next-auth/client";
import { makeHandler } from "next-rest/server";

import prisma from "utils/server/prisma";

// Params that don't appear as path variables will be turned into
// regular query params and retrieved from there automatically :-)
const params = t.intersection([t.type({ id: t.string }), t.partial({ cursor: t.string })]);

const getRequestHeaders = t.type({ accept: t.literal("application/json") });

const getResponseHeaders = t.type({ "content-type": t.literal("application/json") });
const getResponseBody = t.array(
	t.type({
		id: t.string,
		versionNumber: t.string,
		createdAt: t.string,
	})
);

declare module "next-rest" {
	interface API {
		"/api/schema/[id]/versions": Route<{
			params: t.TypeOf<typeof params>;
			methods: {
				GET: {
					request: {
						headers: t.TypeOf<typeof getRequestHeaders>;
						body: void;
					};
					response: {
						headers: t.TypeOf<typeof getResponseHeaders>;
						body: t.TypeOf<typeof getResponseBody>;
					};
				};
			};
		}>;
	}
}

export default makeHandler<"/api/schema/[id]/versions">({
	params: params.is,
	methods: {
		GET: {
			headers: getRequestHeaders.is,
			body: t.void.is,
			exec: async (req, { id, cursor }) => {
				const schema = await prisma.schema.findOne({
					where: { id },
					select: { isPublic: true, agentId: true },
				});

				if (schema === null) {
					throw StatusCodes.NOT_FOUND;
				}

				// We only have to check for the session if the schema is private
				if (!schema.isPublic) {
					// Private schema versions can only be retrieved by their creator agent
					const session = await getSession({ req });
					if (session === null || session.user.agentId !== schema.agentId) {
						throw StatusCodes.NOT_FOUND;
					}
				}

				const versions = await getVersions(id, cursor);
				const result = versions.map(({ id, versionNumber, createdAt }) => ({
					id,
					versionNumber,
					createdAt: createdAt.toISOString(),
				}));

				return [{ "content-type": "application/json" }, result];
			},
		},
	},
});

async function getVersions(id: string, cursor?: string) {
	if (cursor === undefined) {
		return prisma.schemaVersion.findMany({
			take: 10,
			select: { id: true, versionNumber: true, createdAt: true },
			where: { schemaId: id },
			orderBy: { createdAt: "desc" },
		});
	} else {
		const versions = await prisma.schemaVersion.findMany({
			take: 11,
			select: { id: true, versionNumber: true, createdAt: true },
			where: { schemaId: id },
			orderBy: { createdAt: "desc" },
			cursor: { id: cursor },
		});
		return versions.slice(1);
	}
}
