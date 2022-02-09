import React, { useState, FormEvent } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Button, Intent, FormGroup, InputGroup, TextArea } from "@blueprintjs/core";

import { Avatar, AvatarUpload, Form } from "components";

import { getLoginId } from "utils/server/auth/user";

const CreateCommunity: React.FC<{}> = ({}) => {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (evt: FormEvent<EventTarget>) => {
		evt.preventDefault();
		setIsLoading(true);
		const response = await fetch("/api/community", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, description, avatar }),
		});
		const { communitySlug } = await response.json();
		console.log(communitySlug);
		if (communitySlug) {
			window.location.href = `/${communitySlug}`;
		} else {
			setIsLoading(false);
		}
	};

	return (
		<div className="narrow">
			<Head>
				<title>Create Community · Underlay</title>
			</Head>

			<React.Fragment>
				<h1>Create Community</h1>
				<Form onSubmit={handleSubmit}>
					<FormGroup label="Community Name" labelFor="name-input">
						<InputGroup
							id="name-input"
							required={true}
							value={name}
							onChange={(evt) => setName(evt.target.value)}
						/>
					</FormGroup>
					<FormGroup label="Description" labelFor="name-input">
						<TextArea
							id="description-input"
							fill
							growVertically
							style={{ resize: "none" }}
							value={description}
							onChange={(evt) => setDescription(evt.target.value)}
						/>
					</FormGroup>
					<FormGroup label="Avatar" labelFor="avatar-input">
						<div style={{ display: "flex", alignItems: "center" }}>
							<div style={{ marginRight: "10px" }}>
								<Avatar src={avatar} name={name} size={50} />
							</div>
							<AvatarUpload
								onComplete={(val: string) => {
									setAvatar(val);
								}}
								buttonText="Set Community Photo"
							/>
							{avatar && (
								<Button
									icon="trash"
									minimal
									onClick={() => {
										setAvatar(undefined);
									}}
								/>
							)}
						</div>
					</FormGroup>

					<Button
						type="submit"
						text="Create Community"
						intent={Intent.SUCCESS}
						loading={isLoading}
						disabled={!name}
					/>
				</Form>
			</React.Fragment>
		</div>
	);
};

export default CreateCommunity;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const loginId = await getLoginId(context.req);
	/* Do not allow creation if user is not logged in */
	if (!loginId) {
		return {
			redirect: {
				destination: "/login?redirect=/create/community",
				permanent: false,
			},
		};
	}
	return { props: {} };
};
