import React, { useCallback, useState } from "react";
import { GetServerSideProps } from "next";

import { ScopeHeader, ScopeNav } from "components";
import { ResourcePageParams } from "utils/shared/propTypes";

import { prisma } from "utils/server/prisma";
import { LocationContext, usePageContext } from "utils/client/hooks";
import { Heading, majorScale, Pane, TextInput } from "evergreen-ui";

import { slugPattern } from "utils/shared/slug";
import type { NavItem } from "components/ScopeNav/ScopeNav";

type UserSettingsProps = { user: { id: string; slug: string } };

export const getServerSideProps: GetServerSideProps<UserSettingsProps, ResourcePageParams> = async (
	context
) => {
	const { id } = context.params!;

	const user = await prisma.user.findFirst({
		where: { id },
		select: { id: true, slug: true },
	});

	if (user === null || user.slug === null) {
		return { notFound: true };
	}

	return {
		props: { user: { id: user.id, slug: user.slug } },
	};
};

const ownerNavItems: NavItem[] = [{ title: "Overview" }, { mode: "settings", title: "Settings" }];
const nonOwnerNavItems: NavItem[] = [{ title: "Overview" }];

const UserSettingsPage: React.FC<UserSettingsProps> = (props) => {
	const { session } = usePageContext();
	const isOwner = session !== null && session.user.id === props.user.id;

	return (
		<LocationContext.Provider value={{ profileSlug: props.user.slug, mode: "settings" }}>
			<ScopeHeader type="user" />
			<ScopeNav navItems={isOwner ? ownerNavItems : nonOwnerNavItems} />
			<UserSettingsContent {...props} />
		</LocationContext.Provider>
	);
};

function UserSettingsContent(props: UserSettingsProps) {
	const [slug, setSlug] = useState(props.user.slug);
	const handleSlugChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setSlug(value),
		[]
	);

	const nameIsValid = slugPattern.test(slug);

	return (
		<Pane>
			<Heading marginY={majorScale(2)}>Name</Heading>
			<TextInput
				width={majorScale(24)}
				placeholder="[a-z0-9-]"
				isInvalid={!nameIsValid}
				value={slug}
				onChange={handleSlugChange}
			/>
		</Pane>
	);
}

export default UserSettingsPage;
