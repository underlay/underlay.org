import { GetServerSideProps } from "next";

import { Profile } from "components";
import { LocationContext } from "utils/client/hooks";
import { ResourcePageParams } from "utils/shared/propTypes";
import { prisma } from "utils/server/prisma";

export interface OrganizationProfilePageProps {
	organization: {
		slug: string;
	};
}

export const getServerSideProps: GetServerSideProps<
	OrganizationProfilePageProps,
	ResourcePageParams
> = async (context) => {
	const { id } = context.params!;

	const organization = await prisma.organization.findUnique({
		where: { id },
		select: { slug: true },
	});

	if (organization === null) {
		return { notFound: true };
	} else if (organization.slug === null) {
		return { notFound: true };
	}

	return { props: { organization: { slug: organization.slug } } };
};

const UserProfilePage: React.FC<OrganizationProfilePageProps> = ({ organization }) => {
	const profileSlug = organization.slug || undefined;
	return (
		<LocationContext.Provider value={{ profileSlug }}>
			<Profile schemas={[]} />
		</LocationContext.Provider>
	);
};

export default UserProfilePage;
