import React, { useState, FormEvent } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Button, Intent, FormGroup, InputGroup, TextArea, Menu, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";

import { Form } from "components";

import { getLoginId } from "utils/server/auth/user";
import prisma from "prisma/db";

type ValidNamespace = {
	id: string;
	name: string;
	avatar: string;
	slug: string;
};
type Props = {
	validNamespaces: ValidNamespace[];
};

const CreateCollection: React.FC<Props> = ({ validNamespaces }) => {
	const [namespaceId, setNamespaceId] = useState(validNamespaces[0].id);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isPublic, setIsPublic] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (evt: FormEvent<EventTarget>) => {
		evt.preventDefault();
		setIsLoading(true);
		const response = await fetch("/api/collection", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ namespaceId, name, description, isPublic }),
		});
		const newCollection = await response.json();
		if (newCollection) {
			window.location.href = `/${newCollection.namespace.slug}/${newCollection.slug}`;
		} else {
			setIsLoading(false);
		}
	};
	const activeNamespace = validNamespaces.find((namespace) => {
		return namespace.id === namespaceId;
	});
	return (
		<div className="narrow">
			<Head>
				<title>Create Collection · Underlay</title>
			</Head>

			<React.Fragment>
				<h1>Create Collection</h1>
				<p style={{ marginBottom: "50px" }}>
					A collection is a set of curated data that instantiates a specific schema.
					Collections can be updated and versioned to provide a history of data as it
					evolves.
				</p>
				<Form onSubmit={handleSubmit}>
					<Select
						items={validNamespaces}
						itemRenderer={(item: ValidNamespace, { handleClick, modifiers }) => {
							if (!modifiers.matchesPredicate) {
								return null;
							}
							const isSelected = namespaceId === item.id;
							return (
								<MenuItem
									className={isSelected ? "" : "styles.menuItem"}
									active={modifiers.active}
									key={item.id}
									// label={<img src={item.avatar} />}
									onClick={handleClick}
									text={item.name}
									icon={isSelected ? "tick" : undefined}
								/>
							);
						}}
						itemListRenderer={({ items, itemsParentRef, renderItem }) => {
							const renderedItems = items
								.sort((foo, bar) => {
									// if (foo.name > bar.name) {
									// 	return 1;
									// }
									// if (foo.name < bar.name) {
									// 	return -1;
									// }
									return 0;
								})
								.map(renderItem)
								.filter((item) => item != null);

							return (
								<Menu ulRef={itemsParentRef} className={"styles.selectMenu"}>
									{renderedItems}
								</Menu>
							);
						}}
						// noResults={<MenuItem disabled={true} text="No results." />}
						onItemSelect={(item) => {
							setNamespaceId(item.id);
						}}
						filterable={false}
						popoverProps={{
							minimal: true,
							modifiers: {
								preventOverflow: { enabled: false },
								flip: { enabled: false },
							},
						}}
					>
						<Button text={activeNamespace?.name} rightIcon="caret-down" />
					</Select>

					<FormGroup label="Collection Name" labelFor="name-input">
						<InputGroup
							id="name-input"
							required={true}
							value={name}
							onChange={(evt) => setName(evt.target.value)}
						/>
					</FormGroup>
					<FormGroup label="Description" labelFor="name-input">
						<TextArea
							id="description-input"
							fill
							growVertically
							style={{ resize: "none" }}
							value={description}
							onChange={(evt) => setDescription(evt.target.value)}
						/>
					</FormGroup>

					<Button
						type="submit"
						text="Create Collection"
						intent={Intent.SUCCESS}
						loading={isLoading}
						disabled={!name}
					/>
				</Form>
			</React.Fragment>
		</div>
	);
};

export default CreateCollection;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const loginId = await getLoginId(context.req);
	/* Do not allow creation if user is not logged in */
	if (!loginId) {
		return {
			redirect: {
				destination: "/login?redirect=/create/community",
				permanent: false,
			},
		};
	}
	const userWithNamespaces = await prisma.user.findUnique({
		where: {
			id: loginId,
		},
		include: {
			namespace: true,
			memberships: {
				include: { community: { include: { namespace: true } } },
			},
		},
	});
	if (!userWithNamespaces) {
		return { notFound: true };
	}

	const validNamespaces = [
		{
			id: userWithNamespaces?.namespaceId,
			name: userWithNamespaces?.name,
			avatar: userWithNamespaces?.avatar,
			slug: userWithNamespaces?.namespace.slug,
		},
		...userWithNamespaces.memberships.map((membership) => {
			return {
				id: membership.community.namespaceId,
				name: membership.community.name,
				avatar: membership.community.avatar,
				slug: membership.community.namespace.slug,
			};
		}),
	];

	return { props: { validNamespaces } };
};
