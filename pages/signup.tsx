import React, { useState, FormEvent } from "react";
import SHA3 from "crypto-js/sha3";
import encHex from "crypto-js/enc-hex";

import { Button, Intent, FormGroup, InputGroup } from "@blueprintjs/core";

import { SignupPostBody } from "pages/api/signup";

const Signup: React.FC<{}> = ({}) => {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [slug, setSlug] = useState("");
	// const [avatar, setAvatar] = useState(undefined);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (evt: FormEvent<EventTarget>) => {
		evt.preventDefault();
		setIsLoading(true);

		const fetchData: SignupPostBody = {
			name,
			email,
			slug,
			// avatar,
			passwordHash: SHA3(password).toString(encHex),
		};

		const result = await fetch("/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(fetchData),
		});
		if (!result.ok) {
			setIsLoading(false);
			return console.log(result.statusText);
		}
		window.location.href = `/${slug}`;
	};

	return (
		<div>
			<h2>Sign up</h2>
			<form onSubmit={handleSubmit}>
				<FormGroup label="Email" labelFor="email-input" labelInfo="*">
					<InputGroup
						id="email-input"
						autoComplete="username"
						required={true}
						value={email}
						onChange={(evt) => setEmail(evt.target.value.toLowerCase())}
					/>
				</FormGroup>
				<FormGroup label="Password" labelFor="password-input" labelInfo="*">
					<InputGroup
						id="password-input"
						type="password"
						required={true}
						value={password}
						onChange={(evt) => setPassword(evt.target.value)}
					/>
				</FormGroup>
				<FormGroup label="Name" labelFor="name-input" labelInfo="*">
					<InputGroup
						id="name-input"
						required={true}
						value={name}
						onChange={(evt) => setName(evt.target.value)}
					/>
				</FormGroup>
				<FormGroup label="Username" labelFor="username-input" labelInfo="*">
					<InputGroup
						id="username-input"
						required={true}
						value={slug}
						onChange={(evt) => setSlug(evt.target.value)}
					/>
				</FormGroup>

				<Button
					type="submit"
					text="Sign up"
					intent={Intent.PRIMARY}
					loading={isLoading}
					large
				/>
			</form>
		</div>
	);
};

export default Signup;
