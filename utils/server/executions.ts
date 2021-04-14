import { StatusCodes } from "http-status-codes";
import { ApiError } from "next-rest/server";

export const initialExecutionNumber = "x0";
export function getExecutionNumber(execution: { executionNumber: string } | null) {
	if (execution === null) {
		return initialExecutionNumber;
	} else {
		return incrementExecutionNumber(execution.executionNumber);
	}
}

const executionPattern = /^x(\d+)$/;

function incrementExecutionNumber(executionNumber: string) {
	const match = executionPattern.exec(executionNumber);
	if (match !== null) {
		const [_, n] = match;
		return `x${parseInt(n) + 1}`;
	} else {
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
