import { GetServerSidePropsContext } from "next";

import { getCachedSession } from "utils/server/session";

// resource is typed like this so that we're able to be flexible about
// what exactly we pass in, ie both collections and schemas.
// (also different routes will have fetched different properties)
export const getResourcePagePermissions = (
	context: GetServerSidePropsContext,
	resource: { isPublic: boolean; agent: { user: { id: string } | null } }
) => {
	const session = getCachedSession(context);

	if (!resource.isPublic) {
		// For now, a private resource is only accessible by the user that created it.
		// We'll have to update this with more expressive access control logic
		if (session === null) {
			return false;
		} else if (resource.agent.user === null) {
			return false;
		} else if (resource.agent.user.id !== session.user.id) {
			return false;
		}
	}

	return true;
};
