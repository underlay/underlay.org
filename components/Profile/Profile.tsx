import ScopeHeader from "components/ScopeHeader/ScopeHeader";
import Section from "components/Section/Section";

import { Heading, majorScale, Pane, Paragraph, Table } from "evergreen-ui";
import React from "react";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

import styles from "./Profile.module.scss";

interface ResourceProps {
	slug: string;
	isPublic: boolean;
	updatedAt: string;
}

export interface ProfileProps {
	avatar?: string;
	schemas: ResourceProps[];
	collections: ResourceProps[];
	pipelines: ResourceProps[];
}

const Profile: React.FC<ProfileProps> = (props) => {
	const { profileSlug } = useLocationContext();
	return (
		<Pane className={styles.profile}>
			<ScopeHeader type="user" profileTitle={profileSlug} avatar={props.avatar} />
			<Pane marginY={majorScale(8)}>
				<Section title="Schemas">
					{props.schemas.length ? (
						<ResourceTable resources={props.schemas} />
					) : (
						<Paragraph>
							No schemas yet. <a href="/new/schema">Create one?</a>
						</Paragraph>
					)}
				</Section>
				<Section title="Collections">
					{props.collections.length ? (
						<ResourceTable resources={props.collections} />
					) : (
						<Paragraph>
							No collections yet. <a href="/new/collection">Create one?</a>
						</Paragraph>
					)}
				</Section>
				<Section title="Pipelines">
					{props.pipelines.length ? (
						<ResourceTable resources={props.pipelines} />
					) : (
						<Paragraph>
							No pipelines yet. <a href="/new/pipeline">Create one?</a>
						</Paragraph>
					)}
				</Section>
			</Pane>
		</Pane>
	);
};

function ResourceTable(props: { resources: ResourceProps[] }) {
	const { profileSlug } = useLocationContext();

	return (
		<Table background="tint1" border>
			<Table.Head>
				<Table.TextHeaderCell flexBasis={majorScale(32)} flexGrow={0}>
					Name
				</Table.TextHeaderCell>
				<Table.TextHeaderCell>Last updated</Table.TextHeaderCell>
			</Table.Head>
			<Table.Body>
				{props.resources.map(({ slug, updatedAt }) => (
					<Table.Row
						key={slug}
						is="a"
						href={buildUrl({ profileSlug, contentSlug: slug })}
					>
						<Table.Cell flexBasis={majorScale(32)} flexGrow={0}>
							<Heading>{slug}</Heading>
						</Table.Cell>
						<Table.TextCell>{new Date(updatedAt).toDateString()}</Table.TextCell>
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}

export default Profile;
