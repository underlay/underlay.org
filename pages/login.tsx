import React, { useState } from "react";
import SHA3 from "crypto-js/sha3";
import encHex from "crypto-js/enc-hex";

const Login: React.FC<{}> = ({}) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async (evt: any) => {
		evt.preventDefault();
		await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email: email, password: SHA3(password).toString(encHex) }),
		});
		window.location.href = "/";
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleLogin}>
				<label>
					Email:
					<input
						type="text"
						name="email"
						value={email}
						onChange={(evt) => {
							setEmail(evt.target.value);
						}}
					/>
				</label>
				<label>
					Password:
					<input
						type="password"
						name="password"
						value={password}
						onChange={(evt) => {
							setPassword(evt.target.value);
						}}
					/>
				</label>
				<input type="submit" value="Submit" />
			</form>
		</div>
	);
};

export default Login;
