import { GetServerSideProps } from "next";
import type { Session } from "next-auth";

import { Profile } from "components";
import { LocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/propTypes";
import { prisma, serializeUpdatedAt } from "utils/server/prisma";
import { getCachedSession } from "utils/server/session";

interface ResourceProps {
	slug: string;
	isPublic: boolean;
	updatedAt: string;
}

export interface UserProfilePageProps {
	user: { slug: string; avatar: string | null };
	schemas: ResourceProps[];
	collections: ResourceProps[];
	pipelines: ResourceProps[];
}

const selectAgentResourceWhere = (session: Session | null) => ({
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
			agent: { select: { schemas: resources, collections: resources, pipelines: resources } },
		},
	});

	if (user === null) {
		return { notFound: true };
	} else if (user.agent === null) {
		return { notFound: true };
	} else if (user.slug === null) {
		return { redirect: { permanent: false, destination: "/login" } };
	}

	return {
		props: {
			user: { slug: user.slug, avatar: user.avatar },
			schemas: user.agent.schemas.map(serializeUpdatedAt),
			collections: user.agent.collections.map(serializeUpdatedAt),
			pipelines: user.agent.pipelines.map(serializeUpdatedAt),
		},
	};
};

const UserProfilePage: React.FC<UserProfilePageProps> = (props) => {
	return (
		<LocationContext.Provider value={{ profileSlug: props.user.slug }}>
			<Profile
				avatar={props.user.avatar || undefined}
				schemas={props.schemas}
				collections={props.collections}
				pipelines={props.pipelines}
			/>
		</LocationContext.Provider>
	);
};

export default UserProfilePage;
