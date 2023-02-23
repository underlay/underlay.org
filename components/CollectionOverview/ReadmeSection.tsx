import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Section, EmptyState } from "components";
import { CollectionProps } from "utils/server/collections";
import { Button, Intent, TextArea } from "@blueprintjs/core";

import styles from "./ReadmeSection.module.scss";

type Props = CollectionProps & {
	setCollection: ({}) => {};
};

const Readme: React.FC<Props> = function ({ collection, setCollection, isOwner }) {
	const [isEditing, setIsEditing] = useState(false);
	const [readme, setReadme] = useState(collection.readme);
	const [isSaving, setIsSaving] = useState(false);

	const saveEdits = async () => {
		setIsSaving(true);
		await fetch("/api/collection", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				collectionId: collection.id,
				updates: { readme },
				namespaceSlug: collection.namespace.slug,
			}),
		});
		setCollection({ ...collection, readme });
		setIsEditing(false);
		setIsSaving(false);
	};
	const cancelEdits = () => {
		setReadme(collection.readme);
		setIsEditing(false);
	};
	return (
		<Section
			title="Readme"
			className="readme-section"
			action={
				<React.Fragment>
					{isEditing && (
						<React.Fragment>
							<Button outlined small onClick={cancelEdits}>
								Cancel
							</Button>
							<Button
								style={{ marginLeft: "10px" }}
								small
								intent={Intent.SUCCESS}
								onClick={saveEdits}
								loading={isSaving}
							>
								Save Changes
							</Button>
						</React.Fragment>
					)}
					{!isEditing && readme && (
						<Button
							outlined
							small
							icon={"edit"}
							onClick={() => setIsEditing(true)}
							hidden={!isOwner}
						>
							Edit Readme
						</Button>
					)}
				</React.Fragment>
			}
		>
			{!isEditing && readme && <ReactMarkdown children={readme} />}
			{!isEditing && !readme && (
				<EmptyState
					title="No Readme Yet"
					action={
						<Button icon={"edit"} onClick={() => setIsEditing(true)} hidden={!isOwner}>
							Add Readme
						</Button>
					}
				/>
			)}
			{isEditing && (
				<TextArea
					className={styles.textarea}
					value={readme || ""}
					onChange={(evt) => {
						setReadme(evt.target.value);
					}}
					fill
				></TextArea>
			)}
		</Section>
	);
};

export default Readme;
