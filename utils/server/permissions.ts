import { GetServerSidePropsContext } from "next";

import { getCachedSession } from "utils/server/session";

// schema is typed like this so that we're able to be flexible about what exactly we pass in
// (different routes will have fetched different properties)
export const getSchemaPagePermissions = (
	context: GetServerSidePropsContext,
	schema: { isPublic: boolean; agent: { user: { id: string } | null } }
) => {
	const session = getCachedSession(context);

	if (!schema.isPublic) {
		// For now, a private schema is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session === null) {
			return false;
		} else if (schema.agent.user === null) {
			return false;
		} else if (schema.agent.user.id !== session.user.id) {
			return false;
		}
	}

	return true;
};
