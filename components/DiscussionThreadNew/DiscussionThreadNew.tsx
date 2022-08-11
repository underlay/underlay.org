import React, { useState } from "react";
import { Button, FormGroup, InputGroup, Intent, TextArea } from "@blueprintjs/core";

import styles from "./DiscussionThreadNew.module.scss";
import Avatar from "components/Avatar/Avatar";
import { useLoginContext } from "utils/client/hooks";

interface Props {
	collectionId: string;
	entityId?: string;
	discussionThreads?: any;
	setDiscussionThreads?: any;
	redirectPath?: string;
}

const DiscussionThreadNew: React.FC<Props> = function ({
	collectionId,
	entityId,
	discussionThreads,
	setDiscussionThreads,
	redirectPath,
}) {
	const loginData = useLoginContext();
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const handleSubmit = async () => {
		setIsLoading(true);
		const response = await fetch("/api/discussionThread", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title,
				text,
				collectionId: collectionId,
				entityId: entityId,
			}),
		});
		const newDiscussion = await response.json();
		if (newDiscussion && setDiscussionThreads && discussionThreads) {
			setDiscussionThreads([...discussionThreads, newDiscussion]);
			setTitle("");
			setText("");
		} else if (redirectPath) {
			window.location.href = `${redirectPath}/discussions/${newDiscussion.number}`;
		}
		setIsLoading(false);
	};
	return (
		<div className={styles.wrapper}>
			<div className={styles.header}>
				<Avatar src={loginData?.avatar} name={loginData?.name} />
				<FormGroup labelFor="name-input" className={styles.title}>
					<InputGroup
						id="name-input"
						required={true}
						placeholder={"Title..."}
						value={title}
						onChange={(evt) => setTitle(evt.target.value)}
					/>
				</FormGroup>
			</div>
			<FormGroup labelFor="name-input" className={styles.input}>
				<TextArea
					id="description-input"
					fill
					placeholder="Add your comment..."
					growVertically
					style={{ resize: "none" }}
					value={text}
					onChange={(evt) => setText(evt.target.value)}
				/>
			</FormGroup>
			<Button
				className={styles.button}
				intent={Intent.SUCCESS}
				text={"Create New Discussion"}
				loading={isLoading}
				onClick={handleSubmit}
				disabled={title === "" || text === ""}
			/>
		</div>
	);
};

export default DiscussionThreadNew;
