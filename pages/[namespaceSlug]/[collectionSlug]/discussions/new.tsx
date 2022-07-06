import React, { useState } from "react";
import { FormGroup, TextArea, InputGroup, Button, Intent } from "@blueprintjs/core";

import { Avatar, CollectionHeader, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { makeSlug } from "utils/shared/strings";
import { useLoginContext } from "utils/client/hooks";

import styles from "./new.module.scss";

const CollectionNewDiscussion: React.FC<CollectionProps> = function ({ collection }) {
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
				collectionId: collection.id,
			}),
		});
		const newDiscussion = await response.json();
		if (newDiscussion) {
			window.location.href = `/${collection.namespace.slug}/${makeSlug(
				collection.slugPrefix,
				collection.slugSuffix
			)}/discussions/${newDiscussion.number}`;
		} else {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<CollectionHeader mode="discussions" collection={collection} />

			<ThreeColumnFrame
				content={
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
						/>
					</div>
				}
			/>
		</div>
	);
};

export default CollectionNewDiscussion;
export const getServerSideProps = getCollectionProps;
