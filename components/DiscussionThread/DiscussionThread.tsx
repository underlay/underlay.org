import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import TimeAgo from "react-timeago";
import { AnchorButton, Button, FormGroup, Intent, TextArea } from "@blueprintjs/core";

import styles from "./DiscussionThread.module.scss";
import Avatar from "components/Avatar/Avatar";
import { useLoginContext } from "utils/client/hooks";
import classNames from "classnames";

interface Props {
	initDiscussionThread: any;
	minimal?: boolean;
}

const DiscussionThread: React.FC<Props> = function ({ initDiscussionThread, minimal }) {
	const loginData = useLoginContext();

	const [discussionThread, setDiscussionThread] = useState(initDiscussionThread);

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
	const discussionItems = discussionThread?.discussionItems || [];
	return (
		<div className={minimal ? styles.minimal : ""}>
			<h2 className={styles.threadTitle}>
				{discussionThread.title}{" "}
				<span className={styles.number}>#{discussionThread.number}</span>
				{minimal && (
					<AnchorButton
						className={styles.permalinkButton}
						minimal
						small
						href={`discussions/${discussionThread.number}`}
						icon="link"
					/>
				)}
			</h2>
			{discussionItems.map((item: any) => {
				return (
					<div key={item.id} className={styles.discussionItem}>
						<div className={styles.itemHeader}>
							<Avatar src={item.user.avatar} name={item.user.name} size={24} />
							<div className={classNames(styles.name, styles.headerText)}>
								{item.user.name}
							</div>
							<div className={classNames(styles.separator, styles.headerText)}>·</div>
							<TimeAgo
								className={styles.headerText}
								date={item.createdAt}
								minPeriod={60}
							/>
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
							className={styles.textArea}
							style={{ resize: "none" }}
							value={replyText}
							onChange={(evt) => setReplyText(evt.target.value)}
						/>
					</FormGroup>
				</div>
				<div className={styles.replyButton}>
					<Button
						intent={minimal ? undefined : Intent.SUCCESS}
						// small={minimal}
						outlined={minimal}
						icon={minimal ? "tick" : undefined}
						text={minimal ? "" : "Add reply"}
						loading={isLoading}
						onClick={handleSubmit}
					/>
				</div>
			</div>
		</div>
	);
};

export default DiscussionThread;
