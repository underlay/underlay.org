import React, { useCallback, useContext, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { signIn } from "next-auth/client";
import { Pane, Button, TextInput, majorScale, Text, Heading, toaster } from "evergreen-ui";

import { slugPattern } from "utils/shared/slug";
import { SessionUser } from "utils/shared/session";

import api from "next-rest/client";
import StatusCodes from "http-status-codes";
import { PageContext } from "utils/client/hooks";

// A very simple email regex - not intended to be exhaustive
const emailPattern = /^.+@.+\.[a-z]{2,}$/;

function EmailProvider({}) {
	const [email, setEmail] = useState("");
	const isValid = emailPattern.test(email);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = useCallback(() => {
		setIsLoading(true);
		signIn("email", { email });
	}, [email]);

	return (
		<Pane>
			<TextInput
				autoFocus={true}
				value={email}
				onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
					setEmail(value)
				}
				placeholder="alice@example.com"
				isInvalid={!isValid}
				disabled={isLoading}
			/>
			<Button
				marginX={majorScale(1)}
				onClick={handleSubmit}
				isLoading={isLoading}
				disabled={!isValid || isLoading}
			>
				Sign in with Email
			</Button>
		</Pane>
	);
}

function SetSlug({ user, router }: { user: SessionUser; router: NextRouter }) {
	const [slug, setSlug] = useState("");
	const isValid = slugPattern.test(slug);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = useCallback(
		(slug: string) => {
			if (slugPattern.test(slug)) {
				setIsLoading(true);
				api.patch(
					"/api/user/[id]",
					{ id: user.id },
					{ "content-type": "application/json" },
					{ slug }
				)
					.then(([{}]) => {
						toaster.success("Username saved");
						if (typeof router.query.callbackUrl === "string") {
							router.push(router.query.callbackUrl);
						} else {
							router.push("/");
						}
					})
					.catch((err) => {
						setIsLoading(false);
						if (err === StatusCodes.CONFLICT) {
							toaster.danger("Username unavailble");
						} else {
							toaster.danger("Operation failed");
						}
					});
			}
		},
		[user, router]
	);

	return (
		<Pane>
			<Heading marginY={majorScale(1)}>Select a username</Heading>
			<TextInput
				width={majorScale(24)}
				autoFocus={true}
				value={slug}
				onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) =>
					setSlug(value)
				}
				isInvalid={!isValid}
				disabled={isLoading}
				placeholder="[a-zA-Z0-9-]"
			/>
			<Button
				marginX={majorScale(1)}
				appearance="primary"
				onClick={() => handleSubmit(slug)}
				disabled={!isValid || isLoading}
				isLoading={isLoading}
			>
				Save username
			</Button>
		</Pane>
	);
}

const Login = () => {
	const router = useRouter();
	const { session } = useContext(PageContext);

	return (
		<Pane marginY={majorScale(12)} display="flex" justifyContent="center" flexWrap="wrap">
			{router.query.requested === "true" ? (
				<Text>A sign-in link has been sent to your email. You can close this page.</Text>
			) : session === null ? (
				<EmailProvider />
			) : (
				<SetSlug user={session.user} router={router} />
			)}
		</Pane>
	);
};

export default Login;
