import React, { useState } from "react";
import { signIn } from "next-auth/client";
import { Pane, Button, TextInput, majorScale } from "evergreen-ui";

const Login = () => {
	const [email, setEmail] = useState("");
	return (
		<Pane marginY={majorScale(12)} display="flex" justifyContent="center" flexWrap="wrap">
			<TextInput
				margin={majorScale(1)}
				value={email}
				onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
					setEmail(value)
				}
				placeholder="alice@example.com"
			/>
			<Button margin={majorScale(1)} onClick={() => signIn("email", { email })}>
				Sign in with Email
			</Button>
		</Pane>
	);
};

export default Login;
