import React from "react";

import { CollectionHeader, Section, SideNav, ThreeColumnFrame } from "components";
import { getCollectionProps, CollectionProps } from "utils/server/collections";
import { useLocationContext } from "utils/client/hooks";
import { buildUrl } from "utils/shared/urls";
import { FormGroup, InputGroup } from "@blueprintjs/core";

const CollectionSettings: React.FC<CollectionProps> = function ({ collection }) {
	const { namespaceSlug = "", collectionSlug = "", subMode } = useLocationContext().query;
	const activeSubMode = subMode && subMode[0];
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
								<FormGroup label="Name" labelFor="name-input">
									<InputGroup
										id="name-input"
										required={true}
										// value={name}
										// onChange={(evt) => setName(evt.target.value)}
									/>
								</FormGroup>
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
