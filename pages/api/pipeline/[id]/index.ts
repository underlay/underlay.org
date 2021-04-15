import { StatusCodes } from "http-status-codes";
import { isLeft } from "fp-ts/lib/Either.js";
import * as t from "io-ts";

import { getSession } from "next-auth/client";

import { evaluateEvent, EvaluateEventFailure, ValidationError } from "@underlay/pipeline";

import { makeHandler, ApiError } from "next-rest/server";
import { catchPrismaError } from "utils/server/catchPrismaError";

import { prisma, selectAgentProps } from "utils/server/prisma";
import { checkSlugUniqueness } from "utils/server/resource";
import { encodePipelineGraph, pipelineGraph, validatePipelineGraph } from "utils/server/pipeline";
import { slugPattern } from "utils/shared/slug";
import { getExecutionNumber } from "utils/server/executions";
import { buildUrl } from "utils/shared/urls";
import { getProfileSlug } from "utils/shared/propTypes";
import { InvokeCommand } from "@aws-sdk/client-lambda";
import { Lambda } from "utils/server/lambda";
import { isNone } from "fp-ts/lib/Option";

const evaluateEventStream = t.array(evaluateEvent);

const params = t.type({ id: t.string });

const patchRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const patchRequestBody = t.partial({
	slug: t.string,
	description: t.string,
});

const putRequestHeaders = t.type({ "content-type": t.literal("application/json") });
const putRequestBody = pipelineGraph;

const postRequestHeaders = t.type({});
const postRequestBody = t.void;

declare module "next-rest" {
	interface API {
		"/api/pipeline/[id]": Route<{
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
				PUT: {
					request: {
						headers: t.TypeOf<typeof putRequestHeaders>;
						body: t.TypeOf<typeof putRequestBody>;
					};
					response: {
						headers: { "content-type": "application/json" };
						body: ValidationError[];
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

export default makeHandler<"/api/pipeline/[id]">({
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

				const { count } = await prisma.pipeline
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
		PUT: {
			headers: putRequestHeaders.is,
			body: putRequestBody.is,
			exec: async (req, { id }, {}, graph) => {
				const session = await getSession({ req });
				if (session === null) {
					throw new ApiError(StatusCodes.FORBIDDEN);
				}

				const pipeline = await prisma.pipeline.findFirst({
					where: { id, agent: { userId: session.user.id } },
					select: { isPublic: true },
				});

				if (pipeline === null) {
					throw new ApiError(StatusCodes.NOT_FOUND);
				}

				await prisma.pipeline.update({ where: { id }, data: { graph } });
				const errors = await validatePipelineGraph(graph);
				return [{ "content-type": "application/json" }, errors];
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

				const pipeline = await prisma.pipeline.findFirst({
					where: { id, agent: { userId: session.user.id } },
					select: {
						...selectAgentProps,
						slug: true,
						graph: true,
						lastExecution: { select: { id: true, executionNumber: true } },
					},
				});

				if (pipeline === null) {
					throw new ApiError(StatusCodes.NOT_FOUND);
				} else if (!pipelineGraph.is(pipeline.graph)) {
					throw new ApiError(StatusCodes.CONFLICT);
				}

				const executionNumber = getExecutionNumber(pipeline.lastExecution);

				const execution = await prisma.execution.create({
					select: { id: true, token: true },
					data: {
						pipeline: { connect: { id } },
						user: { connect: { id: session.user.id } },
						previousExecution:
							pipeline.lastExecution === null
								? undefined
								: { connect: { id: pipeline.lastExecution.id } },
						isLastExecution: { connect: { id } },
						executionNumber,
						graph: pipeline.graph,
					},
				});

				const graph = encodePipelineGraph(pipeline.graph);
				if (isNone(graph)) {
					throw new ApiError(StatusCodes.CONFLICT);
				}

				const requestPayload = {
					host: process.env.NEXTAUTH_URL!,
					key: execution.id,
					token: execution.token,
					graph: graph.value,
				};

				const command = new InvokeCommand({
					FunctionName: "pipeline-runtime",
					Payload: Buffer.from(JSON.stringify(requestPayload)),
				});

				const response = await Lambda.send(command);

				if (response.Payload === undefined) {
					throw new ApiError(
						StatusCodes.INTERNAL_SERVER_ERROR,
						"Empty response from pipieline evaluation"
					);
				}

				const responsePayload = JSON.parse(Buffer.from(response.Payload).toString("utf-8"));

				const result = evaluateEventStream.decode(responsePayload);
				if (isLeft(result)) {
					console.error(responsePayload);
					throw new ApiError(
						StatusCodes.INTERNAL_SERVER_ERROR,
						"Invalid response from pipeline evaluation"
					);
				}

				const failure = result.right.find(({ event }) => event === "failure") as
					| EvaluateEventFailure
					| undefined;

				await prisma.execution.update({
					where: { id: execution.id },
					data: {
						successful: failure === undefined,
						error: failure === undefined ? null : failure.error,
					},
				});

				const etag = `"${execution.id}"`;

				const profileSlug = getProfileSlug(pipeline.agent);
				const location = buildUrl({
					profileSlug,
					contentSlug: pipeline.slug,
					versionNumber: executionNumber,
				});

				return [{ etag, location }, undefined];
			},
		},
	},
});
