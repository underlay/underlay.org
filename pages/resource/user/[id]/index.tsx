import { GetServerSideProps } from "next";

import { Profile } from "components";
import { LocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/propTypes";
import { prisma, serializeUpdatedAt } from "utils/server/prisma";
import { getCachedSession } from "utils/server/session";
import { ClientSession } from "utils/shared/session";

export interface UserProfilePageProps {
	user: { slug: string; avatar: string | null };
	schemas: {
		slug: string;
		isPublic: boolean;
		updatedAt: string;
	}[];
	collections: {
		slug: string;
		isPublic: boolean;
		updatedAt: string;
	}[];
}

const selectAgentResourceWhere = (session: ClientSession | null) => ({
	where:
		session === null
			? { isPublic: true }
			: {
					OR: [
						{ isPublic: true },
						{
							agent: {
								user: { id: { equals: session.user.id } },
							},
						},
					],
			  },
	select: {
		slug: true,
		isPublic: true,
		updatedAt: true,
	},
});

export const getServerSideProps: GetServerSideProps<
	UserProfilePageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const session = getCachedSession(context);

	const resources = selectAgentResourceWhere(session);
	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			slug: true,
			avatar: true,
			Agent: { select: { schemas: resources, collections: resources } },
		},
	});

	if (user === null) {
		return { notFound: true };
	} else if (user.Agent === null) {
		return { notFound: true };
	} else if (user.slug === null) {
		return { redirect: { permanent: false, destination: "/login" } };
	}

	return {
		props: {
			user: { slug: user.slug, avatar: user.avatar },
			schemas: user.Agent.schemas.map(serializeUpdatedAt),
			collections: user.Agent.collections.map(serializeUpdatedAt),
		},
	};
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, schemas, collections }) => {
	return (
		<LocationContext.Provider value={{ profileSlug: user.slug }}>
			<Profile
				avatar={user.avatar || undefined}
				schemas={schemas}
				collections={collections}
			/>
		</LocationContext.Provider>
	);
};

export default UserProfilePage;
