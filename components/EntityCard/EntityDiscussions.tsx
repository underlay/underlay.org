import React from "react";
import { Dialog } from "@blueprintjs/core";

import DiscussionThreadNew from "components/DiscussionThreadNew/DiscussionThreadNew";
import DiscussionThread from "components/DiscussionThread/DiscussionThread";

import styles from "./EntityDiscussions.module.scss";

interface Props {
	collectionId: string;
	isOpen: boolean;
	setIsOpen: any;
	entityId: string;
	discussionThreads: any;
	setDiscussionThreads: any;
}

const EntityDiscussions: React.FC<Props> = function ({
	collectionId,
	entityId,
	discussionThreads,
	setDiscussionThreads,
	isOpen,
	setIsOpen,
}) {
	return (
		<Dialog
			isOpen={isOpen}
			onClose={() => {
				setIsOpen(false);
			}}
			className={styles.entityDiscussions}
		>
			{discussionThreads.map((thread: any) => {
				return (
					<DiscussionThread
						key={thread.id}
						initDiscussionThread={thread}
						minimal={true}
					/>
				);
			})}
			<div className={styles.separator} />
			<h2 className={styles.newHeader}>New Discussion</h2>
			<DiscussionThreadNew
				collectionId={collectionId}
				entityId={entityId}
				discussionThreads={discussionThreads}
				setDiscussionThreads={setDiscussionThreads}
			/>
		</Dialog>
	);
};

export default EntityDiscussions;
