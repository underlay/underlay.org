import React, { useState, FormEvent } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import SHA3 from "crypto-js/sha3";
import encHex from "crypto-js/enc-hex";
import { Button, Intent, FormGroup, InputGroup, NonIdealState } from "@blueprintjs/core";

import { Avatar, AvatarUpload, Form } from "components";
import { supabase } from "utils/client/supabase";
import { getLoginId } from "utils/server/auth/user";

const Signup: React.FC<{}> = ({}) => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [avatar, setAvatar] = useState<string | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(false);
	const [signupComplete, setSignupComplete] = useState(false);

	const handleSubmit = async (evt: FormEvent<EventTarget>) => {
		evt.preventDefault();
		setIsLoading(true);
		const { session, error } = await supabase.auth.signUp(
			{
				email: email,
				password: SHA3(password).toString(encHex),
			},
			{
				data: { name, avatar },
				redirectTo: `${window.location.origin}?signupCompleted=true`,
			}
		);
		if (!error && session) {
			await fetch("/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: session.access_token }),
			});
			window.location.href = "/";
		}
		if (!error && !session) {
			setSignupComplete(true);
		}
		setIsLoading(false);
	};

	return (
		<div className="narrow">
			<Head>
				<title>Sign up · Underlay</title>
			</Head>

			{!signupComplete && (
				<React.Fragment>
					<h1>Sign up</h1>
					<Form onSubmit={handleSubmit}>
						<FormGroup label="Name" labelFor="name-input">
							<InputGroup
								id="name-input"
								required={true}
								value={name}
								onChange={(evt) => setName(evt.target.value)}
							/>
						</FormGroup>
						<FormGroup label="Email" labelFor="email-input">
							<InputGroup
								id="email-input"
								autoComplete="username"
								required={true}
								value={email}
								onChange={(evt) => setEmail(evt.target.value.toLowerCase())}
							/>
						</FormGroup>
						<FormGroup label="Password" labelFor="password-input">
							<InputGroup
								id="password-input"
								type="password"
								required={true}
								value={password}
								onChange={(evt) => setPassword(evt.target.value)}
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
							text="Create Account"
							intent={Intent.SUCCESS}
							loading={isLoading}
							disabled={!name || !password || !email}
						/>
					</Form>
				</React.Fragment>
			)}
			{signupComplete && (
				<NonIdealState
					title="Welcome!"
					description="We've sent you a verification email - click the link in that message to finish your signup."
					icon={"envelope"}
				/>
			)}
		</div>
	);
};

export default Signup;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const loginId = await getLoginId(context.req);
	/* Do not allow signup if user is already logged in */
	if (loginId) {
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}
	return { props: {} };
};
