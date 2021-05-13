import { useState, useCallback } from "react";

import { useRouter } from "next/router";

import { signIn } from "next-auth/client";
import {
	Heading,
	majorScale,
	Pane,
	Paragraph,
	Select,
	TextInput,
	RadioGroup,
	Button,
	toaster,
} from "evergreen-ui";

import api, { ApiError } from "next-rest/client";

import StatusCodes from "http-status-codes";

import { slugPattern } from "utils/shared/slug";
import { usePageContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";
import { Privacy, privacyOptions } from "utils/client/privacy";

const NewPipeline: React.FC<{}> = ({}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [contentSlug, setContentSlug] = useState("");
	const [description, setDescription] = useState("");
	const [privacy, setPrivacy] = useState<Privacy>("public");

	const { session } = usePageContext();
	const router = useRouter();

	const handleContentSlugChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setContentSlug(value),
		[]
	);

	const handleDescriptionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescription(value),
		[]
	);

	const handleSubmit = useCallback(
		(profileSlug: string) => {
			setIsLoading(true);
			const isPublic = privacy === "public";
			const body = { slug: contentSlug, description, isPublic };
			api.post("/api/pipeline", {}, { "content-type": "application/json" }, body)
				.then(([{}]) => router.push(buildUrl({ profileSlug, contentSlug, mode: "edit" })))
				.catch((err) => {
					setIsLoading(false);
					if (err instanceof ApiError && err.status === StatusCodes.CONFLICT) {
						toaster.danger("Pipeline name unavailable");
					} else {
						console.error(err);
						toaster.danger("Operation failed");
					}
				});
		},
		[contentSlug, description, privacy, router]
	);

	if (session === null) {
		signIn();
		return null;
	}

	const { id: userId, slug: profileSlug } = session.user;

	if (profileSlug === null) {
		signIn();
		return null;
	}

	const nameIsValid = slugPattern.test(contentSlug);

	return (
		<Pane width={majorScale(80)} margin="auto">
			<Heading size={800}>Create a new pipeline</Heading>
			<Paragraph marginY={majorScale(2)}>
				A pipeline is a pipeline is a pipeline is a pipeline
			</Paragraph>
			<Pane display="flex" flexDirection="row" marginY={majorScale(2)}>
				<Pane>
					<Heading marginY={majorScale(1)}>Owner</Heading>
					<Select disabled={true} value={userId} minWidth={majorScale(12)}>
						<option value={userId}>{profileSlug}</option>
					</Select>
				</Pane>
				<Pane marginX={majorScale(4)}>
					<Heading marginY={majorScale(1)}>Pipeline name</Heading>
					<TextInput
						width={majorScale(24)}
						autoFocus={true}
						placeholder="[a-z0-9-]"
						value={contentSlug}
						onChange={handleContentSlugChange}
						isInvalid={!nameIsValid}
					/>
				</Pane>
			</Pane>
			<Pane marginY={majorScale(2)}>
				<Heading marginY={majorScale(1)}>Description</Heading>
				<TextInput
					width="100%"
					value={description}
					onChange={handleDescriptionChange}
				></TextInput>
			</Pane>
			<Pane marginY={majorScale(2)}>
				<Heading marginY={majorScale(1)}>Privacy</Heading>
				<RadioGroup
					value={privacy}
					options={privacyOptions}
					onChange={({ target: { value } }) => setPrivacy(value as Privacy)}
				/>
			</Pane>
			<Button
				appearance="primary"
				onClick={() => handleSubmit(profileSlug)}
				disabled={!nameIsValid || isLoading}
				isLoading={isLoading}
			>
				Create pipeline
			</Button>
		</Pane>
	);
};

export default NewPipeline;
