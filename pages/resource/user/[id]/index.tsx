import { GetServerSideProps } from "next";

import { Profile } from "components";
import { LocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/propTypes";
import { prisma } from "utils/server/prisma";

export interface UserProfilePageProps {
	user: {
		id: string;
		slug: string | null;
	};
}

export const getServerSideProps: GetServerSideProps<
	UserProfilePageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const user = await prisma.user.findUnique({
		where: { id },
		select: { id: true, slug: true },
	});

	if (user === null) {
		return { notFound: true };
	}

	return { props: { user } };
};

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user }) => {
	const profileSlug = user.slug || undefined;

	return (
		<LocationContext.Provider value={{ profileSlug }}>
			<Profile organizationData={{}} />
		</LocationContext.Provider>
	);
};

export default UserProfilePage;
