import { StatusCodes } from "http-status-codes";

import { prisma } from "utils/server/prisma";
import { Prisma } from "@prisma/client";
import { ApiError } from "next-rest/server";

export async function checkSlugUniqueness(agent: Prisma.AgentWhereInput, slug: string) {
	const where = { agent, slug };
	const [schemaCount, collectionCount, pipelineCount] = await Promise.all([
		prisma.collection.count({ where }),
		prisma.schema.count({ where }),
		prisma.pipeline.count({ where }),
	]);

	if (schemaCount || collectionCount || pipelineCount) {
		throw new ApiError(StatusCodes.CONFLICT);
	}
}
