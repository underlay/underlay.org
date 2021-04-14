import React from "react";

import { Paragraph, Table } from "evergreen-ui";

import { ResourceVersionProps } from "utils/shared/propTypes";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";

export interface VersionHistoryProps {
	versions: ResourceVersionProps[];
}

// This component works for both schemas and collections.
// ResourceVersionProps just has the basic properties that are common to both.
const VersionHistory: React.FC<VersionHistoryProps> = (props) => {
	const { profileSlug, contentSlug } = useLocationContext();

	if (props.versions.length === 0) {
		return <Paragraph fontStyle="italic">No versions yet!</Paragraph>;
	}

	return (
		<Table background="tint1" border>
			<Table.Head>
				<Table.TextHeaderCell>Version number</Table.TextHeaderCell>
				<Table.TextHeaderCell>User</Table.TextHeaderCell>
				<Table.TextHeaderCell>Date</Table.TextHeaderCell>
			</Table.Head>
			<Table.Body>
				{props.versions.map(({ id, versionNumber, createdAt, user }) => {
					const href = buildUrl({ profileSlug, contentSlug, versionNumber });
					const createdAtDate = new Date(createdAt);
					return (
						<Table.Row key={id} is="a" href={href}>
							<Table.TextCell>{versionNumber}</Table.TextCell>
							<Table.TextCell>@{user.slug}</Table.TextCell>
							<Table.TextCell>
								{createdAtDate.toDateString()} at{" "}
								{createdAtDate.toLocaleTimeString()}
							</Table.TextCell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table>
	);
};

export default VersionHistory;
