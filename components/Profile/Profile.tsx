import React from "react";

import { Badge, Heading, Link, majorScale, minorScale, Pane, Paragraph, Table } from "evergreen-ui";

import { ScopeHeader, ScopeNav } from "components";

import { useLocationContext, usePageContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

interface Resource {
	slug: string;
	isPublic: boolean;
	updatedAt: string;
}

export interface ProfileProps {
	schemas: Resource[];
	collections: Resource[];
	pipelines: Resource[];
}

const ownerNavItems = [{ title: "Overview" }, { mode: "settings", title: "Settings" }];
const nonOwnerNavItems = [{ title: "Overview" }];

const Profile: React.FC<ProfileProps> = (props) => {
	const { profileSlug } = useLocationContext();
	const { session } = usePageContext();

	const isCurrentProfile = session !== null && session.user.slug === profileSlug;

	const navItems = isCurrentProfile ? ownerNavItems : nonOwnerNavItems;

	return (
		<Pane>
			<ScopeHeader type="user" />
			<ScopeNav navItems={navItems} />
			<Heading marginY={majorScale(2)}>Schemas</Heading>
			{props.schemas.length ? (
				<ResourceTable resources={props.schemas} />
			) : isCurrentProfile ? (
				<Paragraph>
					No schemas yet. <Link href="/new/schema">Create one?</Link>
				</Paragraph>
			) : (
				<Paragraph>No schemas yet.</Paragraph>
			)}
			<Heading marginY={majorScale(2)}>Collections</Heading>
			{props.collections.length ? (
				<ResourceTable resources={props.collections} />
			) : isCurrentProfile ? (
				<Paragraph>
					No collections yet. <Link href="/new/collection">Create one?</Link>
				</Paragraph>
			) : (
				<Paragraph>No collections yet.</Paragraph>
			)}
			<Heading marginY={majorScale(2)}>Pipelines</Heading>
			{props.pipelines.length ? (
				<ResourceTable resources={props.pipelines} />
			) : isCurrentProfile ? (
				<Paragraph>
					No pipelines yet. <Link href="/new/pipeline">Create one?</Link>
				</Paragraph>
			) : (
				<Paragraph>No pipelines yet.</Paragraph>
			)}
		</Pane>
	);
};

function ResourceTable(props: { resources: Resource[] }) {
	const { profileSlug } = useLocationContext();

	return (
		<Table background="tint1" border="muted">
			<Table.Head>
				<Table.TextHeaderCell flexBasis={majorScale(32)} flexGrow={0}>
					Name
				</Table.TextHeaderCell>
				<Table.TextHeaderCell>Last updated</Table.TextHeaderCell>
			</Table.Head>
			<Table.Body>
				{props.resources.map(({ slug, updatedAt, isPublic }) => (
					<Table.Row
						key={slug}
						is="a"
						href={buildUrl({ profileSlug, contentSlug: slug })}
					>
						<Table.TextCell flexBasis={majorScale(32)} flexGrow={0}>
							{slug} {isPublic || <Badge marginX={minorScale(1)}>Private</Badge>}
						</Table.TextCell>
						<Table.TextCell>{new Date(updatedAt).toDateString()}</Table.TextCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}

export default Profile;
