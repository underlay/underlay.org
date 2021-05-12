import React, { useCallback, useState } from "react";
import { Heading, majorScale, Pane, SegmentedControl, TextInput } from "evergreen-ui";

import { privacyOptions } from "utils/client/privacy";
import { slugPattern } from "utils/shared/slug";

export interface ResourceSettingsProps {
	slug: string;
	description: string;
	isPublic: boolean;
}

const ResourceSettings: React.FC<ResourceSettingsProps> = (props) => {
	const [slug, setSlug] = useState(props.slug);
	const handleSlugChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setSlug(value),
		[]
	);

	const [description, setDescription] = useState(props.description);
	const handleDescriptionChange = useCallback(
		({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescription(value),
		[]
	);

	const [isPublic, setIsPublic] = useState(props.isPublic);
	const handlePrivacyChange = useCallback(
		(value: string | number | boolean) => setIsPublic(value === "public"),
		[]
	);

	const nameIsValid = slugPattern.test(slug);

	return (
		<Pane>
			<Heading marginY={majorScale(2)}>Name</Heading>
			<TextInput
				width={majorScale(72)}
				placeholder="[a-z0-9-]"
				isInvalid={!nameIsValid}
				value={slug}
				onChange={handleSlugChange}
			/>
			<Heading marginY={majorScale(2)}>Description</Heading>
			<TextInput
				width={majorScale(72)}
				value={description}
				onChange={handleDescriptionChange}
			/>
			<Heading marginY={majorScale(2)}>Privacy</Heading>
			<SegmentedControl
				width={majorScale(24)}
				value={isPublic ? "public" : "private"}
				options={privacyOptions}
				onChange={handlePrivacyChange}
			/>
		</Pane>
	);
};

export default ResourceSettings;
