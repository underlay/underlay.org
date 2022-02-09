import React, { useState, FormEvent } from "react";
import Head from "next/head";
import SHA3 from "crypto-js/sha3";
import encHex from "crypto-js/enc-hex";
import { Button, FormGroup, InputGroup, Intent } from "@blueprintjs/core";

import { Form } from "components";
import { supabase } from "utils/client/supabase";
import { useLocationContext } from "utils/client/hooks";

const Login: React.FC<{}> = ({}) => {
	const { query } = useLocationContext();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (evt: FormEvent<EventTarget>) => {
		setIsLoading(true);
		evt.preventDefault();
		const { session, error } = await supabase.auth.signIn({
			email,
			password: SHA3(password).toString(encHex),
		});
		if (error) {
			setIsLoading(false);
		} else if (session) {
			await fetch("/api/token", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: session.access_token }),
			});
			window.location.href = query.redirect || "/";
		}
	};

	return (
		<div className="narrow">
			<Head>
				<title>Login · Underlay</title>
			</Head>
			<h2>Login</h2>
			<Form onSubmit={handleLogin}>
				<FormGroup label="Email" labelFor="email-input">
					<InputGroup
						id="email-input"
						required={true}
						value={email}
						onChange={(evt) => setEmail(evt.target.value)}
					/>
				</FormGroup>

				<FormGroup label="Password" labelFor="password-input">
					<InputGroup
						id="password-input"
						type="password"
						required={true}
						value={password}
						onChange={(evt) => {
							setPassword(evt.target.value);
						}}
					/>
				</FormGroup>

				<Button
					type="submit"
					text="Login"
					intent={Intent.SUCCESS}
					loading={isLoading}
					disabled={!email || !password}
				/>
			</Form>
		</div>
	);
};

export default Login;
