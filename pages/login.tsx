import React, { useState } from "react";
import { signIn } from "next-auth/client";
import { Button } from "evergreen-ui";

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
			<Button onClick={() => signIn("email", { email })}>Sign in with Email</Button>
		</div>
	);
};

export default Login;
