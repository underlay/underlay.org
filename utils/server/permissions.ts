import { GetServerSidePropsContext } from "next";

import { getCachedSession } from "utils/server/session";

// schema is typed like this so that we're able to be flexible about what exactly we pass in
// (different routes will have fetched different properties)
export const getSchemaPagePermissions = (
	context: GetServerSidePropsContext,
	schema: { isPublic: boolean; agent: { userId: string | null } }
) => {
	const session = getCachedSession(context);

	if (!schema.isPublic) {
		if (session === null) {
			return false;
		}

		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session.user.id !== schema.agent.userId) {
			return false;
		}
	}

	return true;
};
