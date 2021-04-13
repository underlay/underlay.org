import { StatusCodes } from "http-status-codes";
import { ApiError } from "next-rest/server";

export const initialExecutionNumber = "0";
export function getExecutionNumber(execution: { executionNumber: string } | null) {
	if (execution === null) {
		return initialExecutionNumber;
	} else {
		return incrementExecutionNumber(execution.executionNumber);
	}
}

const executionPattern = /^\d+$/;

function incrementExecutionNumber(executionNumber: string) {
	if (executionPattern.test(executionNumber)) {
		const number = parseInt(executionNumber);
		return (number + 1).toString();
	} else {
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR);
	}
}
