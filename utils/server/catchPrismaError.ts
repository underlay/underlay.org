import { PrismaClientKnownRequestError } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

// It's important for typechecking that this function returns never.
// All that it does is check for known prisma errors and conver them into
// appropriate HTTP status codes.
export function catchPrismaError(err: any): never {
	if (err instanceof PrismaClientKnownRequestError) {
		// This is the prisma code for unique constraint failures
		// See https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/error-reference
		if (err.code === "P2002") {
			throw StatusCodes.CONFLICT;
		}
	}
	throw err;
}
