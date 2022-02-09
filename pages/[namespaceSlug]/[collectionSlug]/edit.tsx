import React from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { Button, Intent } from "@blueprintjs/core";

import { CollectionHeader } from "components";
import { CollectionPageParams } from "utils/shared/types";
import { getCollectionData } from "utils/server/queries";
import { useLocationContext } from "utils/client/hooks";

import Editor from "components/Editor/Editor";

type Props = {
	slug: string;
	permission: string;
	labels?: any;
};

const CollectionEdit: React.FC<Props> = function ({ permission, labels }) {
	const { namespaceSlug = "", collectionSlug = "" } = useLocationContext().query;
	return (
		<div>
			<Head>
				<title>
					{namespaceSlug}/{collectionSlug} · Underlay
				</title>
			</Head>
			<CollectionHeader
				mode="edit"
				isPrivate={true || permission === "private"}
				labels={labels}
			/>
			{/* <img
				style={{ marginTop: 50 }}
				width="100%"
				src="https://s3.amazonaws.com/assets.underlay.org/dev-user-uploads/20223645ee209717b4c6f7c874bedd96.png"
			/> */}
			<div style={{ margin: "50px 0px" }}>
				<Editor />
			</div>
			<div style={{ margin: "50px 0px" }}>
				<h4>Change Log (34 edits)</h4>
				<ul>
					<li>
						<span
							style={{
								opacity: 0.6,
								marginRight: "1em",
								width: 120,
								display: "inline-block",
							}}
						>
							2 minutes ago
						</span>
						<b>Beth Morley</b> edited 12 entities.
					</li>
					<li>
						<span
							style={{
								opacity: 0.6,
								marginRight: "1em",
								width: 120,
								display: "inline-block",
							}}
						>
							12 hours ago
						</span>
						<b>Darren Hurst</b> added 39 entites and 47 relationships with{" "}
						<b>a script</b>.
					</li>
					<li>
						<span
							style={{
								opacity: 0.6,
								marginRight: "1em",
								width: 120,
								display: "inline-block",
							}}
						>
							3 days ago
						</span>
						<b>Anonymous</b>suggested one edit.
					</li>
					<li>
						<span
							style={{
								opacity: 0.6,
								marginRight: "1em",
								width: 120,
								display: "inline-block",
							}}
						>
							6 days ago
						</span>
						<b>Beth Morley</b> removed 12 entities and their 37 relationships.
					</li>
					<li>View 33 more...</li>
				</ul>
			</div>
			<Button large intent={Intent.SUCCESS} text="Publish version 1.3.17" />
		</div>
	);
};

export default CollectionEdit;

export const getServerSideProps: GetServerSideProps<Props, CollectionPageParams> = async (
	context
) => {
	const { namespaceSlug, collectionSlug } = context.params!;
	const collectionData = await getCollectionData(namespaceSlug, collectionSlug);

	if (!collectionData) {
		return { notFound: true };
	}

	return {
		props: {
			slug: collectionData.slug,
			permission: collectionData.permission,
			labels: collectionData.labels || undefined,
		},
	};
};
