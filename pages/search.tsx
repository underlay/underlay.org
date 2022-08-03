import React, { useState } from "react";
import { GetServerSideProps } from "next";

import { ThreeColumnFrame, Section, Form } from "components";
import Head from "next/head";
import { useRouter } from "next/router";
import { Collection } from "@prisma/client";
import { getSearchResults } from "utils/server/queries";
import SearchResultList from "components/SearchResultList/SearchResultList";
import { InputGroup } from "@blueprintjs/core";

type Props = {
	collections: Collection[];
};

const Search: React.FC<Props> = function ({ collections }) {
	const router = useRouter();

	const [localQuery, setLocalQuery] = useState(router.query.q as string);

	return (
		<div>
			<Head>
				<title>Search · Underlay</title>
			</Head>
			<ThreeColumnFrame
				content={
					<Section
						title={`Search for ${localQuery} returned ${collections.length} results`}
					>
						<Form
							onSubmit={(evt) => {
								evt.preventDefault();
							}}
						>
							<InputGroup
								id="search-input"
								required={true}
								style={{ marginBottom: "1rem" }}
								value={localQuery}
								onChange={(evt) => {
									setLocalQuery(evt.target.value);
								}}
								placeholder="Find collections to use and communities to join..."
								onKeyDown={(evt) => {
									if (evt.code === "Enter") {
										evt.preventDefault();
										router.push({
											pathname: "/search",
											query: { q: localQuery },
										});
									}
								}}
							/>
						</Form>
						{collections.length !== 0 && (
							<SearchResultList
								collections={collections}
								queryString={localQuery as any}
							/>
						)}
					</Section>
				}
				sideContent={<div></div>}
			/>
		</div>
	);
};

export default Search;

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
	if (!("q" in context.query)) {
		return {
			props: {
				collections: [],
			},
		};
	}

	const results = await getSearchResults(context.query as any);

	const namespaceOrCollectionMatches: Collection[] = [];
	const descriptionMatches: Collection[] = [];
	results.forEach((c) => {
		if (
			c.namespace.slug.includes(context.query.q as string) ||
			c.slugPrefix.includes(context.query.q as string)
		) {
			namespaceOrCollectionMatches.push(c);
		} else {
			descriptionMatches.push(c);
		}
	});

	return {
		props: {
			collections: [...namespaceOrCollectionMatches, ...descriptionMatches],
		},
	};
};
