import React from "react";
import { GetServerSideProps } from "next";
import prisma from "prisma/db";
import { nodes, entities, relationships } from "components/Editor/data";

import { Landing } from "components";

type SchemaProps = {
	entityJson: string;
	schemaNodeJson: string;
	relationshipJson: string;
};

const Home: React.FC<SchemaProps> = (schemaData) => {
	return <Landing data={schemaData} />;
};

export default Home;

export const getServerSideProps: GetServerSideProps<SchemaProps> = async (context) => {
	const collections = await prisma.collection.findMany();
	const collectionWithSchemas = collections.filter((c) => !!c.schemaJson);
	if (collectionWithSchemas.length > 0) {
		return {
			props: collectionWithSchemas[0].schemaJson as SchemaProps,
		};
	} else {
		return {
			props: {
				entityJson: JSON.stringify(entities),
				schemaNodeJson: JSON.stringify(nodes),
				relationshipJson: JSON.stringify(relationships),
			},
		};
	}
};
