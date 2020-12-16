import { GetServerSideProps } from "next";

import { Profile } from "components";
import { LocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/propTypes";
import { prisma, serializeUpdatedAt } from "utils/server/prisma";
import { getCachedSession } from "utils/server/session";

export interface UserProfilePageProps {
	user: { slug: string; avatar: string | null };
	schemas: {
		slug: string;
		description: string;
		avatar: string | null;
		isPublic: boolean;
		updatedAt: string;
	}[];
}

export const getServerSideProps: GetServerSideProps<
	UserProfilePageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const session = getCachedSession(context);

	const user = await prisma.user.findUnique({
		where: { id },
		select: {
			id: true,
			slug: true,
			avatar: true,
			Agent: {
				select: {
					schemas: {
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
							description: true,
							avatar: true,
							isPublic: true,
							updatedAt: true,
						},
					},
				},
			},
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
		},
	};
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, schemas }) => {
	return (
		<LocationContext.Provider value={{ profileSlug: user.slug }}>
			<Profile avatar={user.avatar || undefined} schemas={schemas} />
		</LocationContext.Provider>
	);
};

export default UserProfilePage;
