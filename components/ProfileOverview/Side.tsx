import React from "react";

import Section from "components/Section";
import Avatar from "components/Avatar";
import DiscussionList from "components/DiscussionList";
import { Discussion } from "components/DiscussionPreview";

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
									initial={member.user.initial}
									width={35}
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
