import React from "react";
import { Avatar } from "evergreen-ui";

import { DiscussionList, Section } from "components";
import { Discussion } from "components/DiscussionPreview/DiscussionPreview";

type Props = {
	discussions: Discussion[];
	members: { user: { slug: string; avatar: string; initial: string } }[];
};

const NamespaceOverviewSide: React.FC<Props> = function ({ discussions, members = [] }) {
	return (
		<React.Fragment>
			<Section title="Recent Discussions">
				<DiscussionList discussions={discussions} />
			</Section>
			{!!members.length && (
				<Section title="People">
					{members.map((member) => {
						return (
							<a href={`/${member.user.slug}`} key={member.user.slug}>
								<Avatar
									src={member.user.avatar}
									name={member.user.initial}
									size={35}
									borderRadius="3px"
								/>
							</a>
						);
					})}
				</Section>
			)}
		</React.Fragment>
	);
};

export default NamespaceOverviewSide;
