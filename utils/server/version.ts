import { StatusCodes } from "http-status-codes";
import { ApiError } from "next-rest/server";

import { isTypeEqual, Schema } from "@underlay/apg";
import { decode } from "@underlay/apg-format-binary";
import schemaSchema, { toSchema } from "@underlay/apg-schema-schema";

export const initialVersionNumber = "v0.0.0";

export function getVersionNumber(
	oldVersion: { versionNumber: string; schemaInstance: Buffer } | null,
	newSchema: Schema.Schema
) {
	if (oldVersion === null) {
		return initialVersionNumber;
	} else {
		const oldSchema = toSchema(decode(schemaSchema, oldVersion.schemaInstance));
		return incrementVersionNumber(oldVersion.versionNumber, oldSchema, newSchema);
	}
}

const versionPattern = /^v0\.(\d+)\.(\d+)$/;

export function incrementVersionNumber(
	oldVersionNumber: string,
	oldSchema: Schema.Schema,
	newSchema: Schema.Schema
): string {
	const match = versionPattern.exec(oldVersionNumber);
	if (match === null) {
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR);
	}

	const [_, minor, patch] = match;

	const newPatch = parseInt(patch) + 1;
	const newMinor = parseInt(minor) + 1;
	if (isNaN(newPatch) || isNaN(newMinor)) {
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR);
	}

	if (isSchemaEqual(oldSchema, newSchema)) {
		return `v0.${minor}.${newPatch}`;
	} else {
		return `v0.${newMinor}.0`;
	}
}

function isSchemaEqual(A: Schema.Schema, B: Schema.Schema) {
	const keys = new Set(Object.keys(B));

	for (const key in A) {
		if (key in B && isTypeEqual(A[key], B[key])) {
			keys.delete(key);
			continue;
		} else {
			return false;
		}
	}

	return keys.size === 0;
}
