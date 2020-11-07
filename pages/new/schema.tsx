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

import { slugPattern } from "utils/shared/slug";
import { usePageContext } from "utils/client/hooks";
import StatusCodes from "http-status-codes";

// const namePatternErrorMessage =
// 	"The schema name cannot be empty, and can only use letters, numbers, and hypens.";

type Privacy = "private" | "public";
const privacyOptions: { label: string; value: Privacy }[] = [
	{ label: "Private", value: "private" },
	{ label: "Public", value: "public" },
];

const NewSchema: React.FC<{}> = ({}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [schemaSlug, setSchemaSlug] = useState("");
	const [description, setDescription] = useState("");
	const [privacy, setPrivacy] = useState<Privacy>("public");

	const { session } = usePageContext();
	const router = useRouter();

	const handleSchemaSlugChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setSchemaSlug(value),
		[]
	);

	const handleDescriptionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescription(value),
		[]
	);

	const handleSubmit = useCallback(
		(userSlug: string, agentId: string) => {
			setIsLoading(true);
			const isPublic = privacy === "public";
			const body = { agentId, slug: schemaSlug, description, isPublic };
			api.post("/api/schema", {}, { "content-type": "application/json" }, body)
				.then(([{}]) => router.push(`/${userSlug}/schemas/${schemaSlug}`))
				.catch((error) => {
					setIsLoading(false);
					if (error === StatusCodes.CONFLICT) {
						toaster.danger(`Schema name unavailable`);
					} else {
						toaster.danger(error.toString());
					}
				});
		},
		[schemaSlug, description, privacy, router]
	);

	if (session === null) {
		signIn();
		return null;
	}

	const { agentId, slug: userSlug } = session.user;

	if (userSlug === null) {
		signIn();
		return null;
	}

	const nameIsValid = slugPattern.test(schemaSlug);

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
					<Select disabled={true} value={agentId} minWidth={majorScale(12)}>
						<option value={agentId}>{userSlug}</option>
					</Select>
				</Pane>
				<Pane marginX={majorScale(4)}>
					<Heading marginY={majorScale(1)}>Schema name</Heading>
					<TextInput
						width={majorScale(24)}
						autoFocus={true}
						placeholder="[a-zA-Z0-9-]"
						value={schemaSlug}
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
				onClick={() => handleSubmit(userSlug, agentId)}
				disabled={!nameIsValid || isLoading}
				isLoading={isLoading}
			>
				Create schema
			</Button>
		</Pane>
	);
};

export default NewSchema;
