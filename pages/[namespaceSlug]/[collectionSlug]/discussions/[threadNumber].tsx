import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import TimeAgo from "react-timeago";
import { Button, FormGroup, Intent, TextArea } from "@blueprintjs/core";

import { Avatar, CollectionHeader, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext, useLoginContext } from "utils/client/hooks";

import styles from "./[threadNumber].module.scss";

const CollectionDiscussions: React.FC<CollectionProps> = function ({ collection }) {
	const loginData = useLoginContext();
	const { query } = useLocationContext();
	const { threadNumber } = query;
	const initDiscussionThread = collection.discussionThreads.find((thread) => {
		return thread.number === Number(threadNumber);
	});
	const [discussionThread, setDiscussionThread] = useState(initDiscussionThread);
	if (!discussionThread) {
		return null;
	}
	const [replyText, setReplyText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmit = async () => {
		setIsLoading(true);
		const response = await fetch("/api/discussionItem", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				text: replyText,
				discussionThreadId: discussionThread.id,
			}),
		});
		const newDiscussionItem = await response.json();
		setDiscussionThread({
			...discussionThread,
			discussionItems: [...discussionThread.discussionItems, newDiscussionItem],
		});
		setReplyText("");
		setIsLoading(false);
	};

	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />
			<ThreeColumnFrame
				content={
					<div>
						<h2 className={styles.threadTitle}>
							{discussionThread.title}{" "}
							<span className={styles.number}>#{discussionThread.number}</span>
						</h2>
						{discussionThread?.discussionItems.map((item) => {
							return (
								<div key={item.id} className={styles.discussionItem}>
									<div className={styles.itemHeader}>
										<Avatar
											src={item.user.avatar}
											name={item.user.name}
											size={24}
										/>
										<div className={styles.name}>{item.user.name}</div>
										<div className={styles.separator}>·</div>
										<TimeAgo date={item.createdAt} />
									</div>
									<div className={styles.textBody}>
										<ReactMarkdown children={item.text || ""} />
									</div>
								</div>
							);
						})}
						<div className={styles.reply}>
							<div className={styles.replyBody}>
								<Avatar src={loginData?.avatar} name={loginData?.name} size={24} />
								<FormGroup labelFor="name-input" className={styles.replyInput}>
									<TextArea
										id="description-input"
										placeholder="Add a reply..."
										fill
										growVertically
										style={{ resize: "none" }}
										value={replyText}
										onChange={(evt) => setReplyText(evt.target.value)}
									/>
								</FormGroup>
							</div>
							<div className={styles.replyButton}>
								<Button
									intent={Intent.SUCCESS}
									text={"Add reply"}
									loading={isLoading}
									onClick={handleSubmit}
								/>
							</div>
						</div>
					</div>
				}
			/>
		</div>
	);
};

export default CollectionDiscussions;
export const getServerSideProps = getCollectionProps;
