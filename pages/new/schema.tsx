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

import api from "next-rest/client";

import StatusCodes from "http-status-codes";

import { slugPattern } from "utils/shared/slug";
import { usePageContext, useStateRef } from "utils/client/hooks";
import { Privacy, privacyOptions } from "utils/client/privacy";

const NewSchema: React.FC<{}> = ({}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [contentSlug, setContentSlug, contentSlugRef] = useStateRef("");
	const [description, setDescription, descriptionRef] = useStateRef("");
	const [privacy, setPrivacy, privacyRef] = useStateRef<Privacy>("public");

	const { session } = usePageContext();
	const router = useRouter();

	const handleSchemaSlugChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setContentSlug(value),
		[]
	);

	const handleDescriptionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescription(value),
		[]
	);

	const handleSubmit = useCallback(() => {
		setIsLoading(true);
		const slug = contentSlugRef.current;
		const description = descriptionRef.current;
		const isPublic = privacyRef.current === "public";
		const body = { slug, description, isPublic };
		api.post("/api/schema", {}, { "content-type": "application/json" }, body)
			.then(([{ location }]) => router.push(location))
			.catch((error) => {
				setIsLoading(false);
				if (error === StatusCodes.CONFLICT) {
					toaster.danger(`Schema name unavailable`);
				} else {
					toaster.danger(error.toString());
				}
			});
	}, []);

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
			<Heading size={800}>Create a new schema</Heading>
			<Paragraph marginY={majorScale(2)}>
				A schema describes the shape of data. Data in a collection instantiates a specific
				schema. Re-using schemas increases data compatibility.
			</Paragraph>
			<Pane display="flex" flexDirection="row" marginY={majorScale(2)}>
				<Pane>
					<Heading marginY={majorScale(1)}>Owner</Heading>
					<Select disabled={true} value={userId} minWidth={majorScale(12)}>
						<option value={userId}>{profileSlug}</option>
					</Select>
				</Pane>
				<Pane marginX={majorScale(4)}>
					<Heading marginY={majorScale(1)}>Schema name</Heading>
					<TextInput
						width={majorScale(24)}
						autoFocus={true}
						placeholder="[a-z0-9-]"
						value={contentSlug}
						onChange={handleSchemaSlugChange}
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
				onClick={handleSubmit}
				disabled={!nameIsValid || isLoading}
				isLoading={isLoading}
			>
				Create schema
			</Button>
		</Pane>
	);
};

export default NewSchema;
