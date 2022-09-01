import React, { useState } from "react";

import { CollectionHeader, Section, SideNav, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";
import { Button, ButtonGroup, FormGroup, InputGroup, Intent } from "@blueprintjs/core";
import { useRouter } from "next/router";
import { slugifyString } from "utils/shared/strings";

const CollectionSettings: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "", subMode } = useLocationContext().query;
	const [slugPrefix, setSlugPrefix] = useState(collection.slugPrefix);
	const [description, setDescription] = useState(collection.description || "");
	const [isPublic, setIsPublic] = useState(collection.isPublic);
	const activeSubMode = subMode && subMode[0];

	const [isUpdating, setIsUpdating] = useState(false);

	const router = useRouter();

	const saveEdits = async () => {
		setIsUpdating(true);

		await fetch("/api/collection", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				collectionId: collection.id,
				updates: { slugPrefix: slugifyString(slugPrefix), description, isPublic },
			}),
		});

		setIsUpdating(false);

		if (collectionSlug !== `${slugPrefix}-${collection.slugSuffix}`) {
			router.push(`/${namespaceSlug}/${slugPrefix}-${collection.slugSuffix}/settings`);
		}
	};

	return (
		<div>
			<CollectionHeader mode="settings" collection={collection} />
			<ThreeColumnFrame
				navContent={
					<SideNav
						menuItems={[
							{
								text: "Details",
								href: buildUrl({
									namespaceSlug: namespaceSlug,
									collectionSlug: collectionSlug,
									mode: "settings",
									subMode: "",
								}),
								active: !activeSubMode,
							},
							{
								text: "Members",
								href: buildUrl({
									namespaceSlug: namespaceSlug,
									collectionSlug: collectionSlug,
									mode: "settings",
									subMode: "members",
								}),
								active: activeSubMode === "members",
							},
						]}
					/>
				}
				content={
					<React.Fragment>
						{!activeSubMode && (
							<Section title="Collection Details">
								<FormGroup label="Collection slug" labelFor="slug-prefix-input">
									<InputGroup
										id="slug-prefix-input"
										required={true}
										value={slugPrefix}
										onChange={(evt) => setSlugPrefix(evt.target.value)}
									/>
								</FormGroup>
								<FormGroup label="Collection slug" labelFor="description-input">
									<InputGroup
										id="description-input"
										required={true}
										value={description}
										onChange={(evt) => setDescription(evt.target.value)}
									/>
								</FormGroup>
								<FormGroup label="Privacy">
									<ButtonGroup>
										<Button
											text="Public"
											active={isPublic === true}
											onClick={() => {
												setIsPublic(true);
											}}
										/>
										<Button
											text="Private"
											active={isPublic !== true}
											onClick={() => {
												setIsPublic(false);
											}}
										/>
									</ButtonGroup>
								</FormGroup>

								<Button
									text="Update collection"
									intent={Intent.SUCCESS}
									style={{ marginTop: "12px" }}
									loading={isUpdating}
									onClick={() => {
										saveEdits();
									}}
								/>
							</Section>
						)}
						{activeSubMode === "members" && (
							<Section title="Collection Members">
								<div>Manage Members here</div>
							</Section>
						)}
					</React.Fragment>
				}
			/>
		</div>
	);
};

export default CollectionSettings;
export const getServerSideProps = getCollectionProps;
