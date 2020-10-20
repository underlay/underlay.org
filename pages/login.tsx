import React, { useState } from "react";
import { signIn } from "next-auth/client";

const Login = () => {
	const [email, setEmail] = useState("");
	return (
		<div>
			<input
				value={email}
				onChange={(evt) => {
					setEmail(evt.target.value);
				}}
			/>
			<button onClick={() => signIn("email", { email })}>Sign in with Email</button>
		</div>
	);
};

export default Login;
