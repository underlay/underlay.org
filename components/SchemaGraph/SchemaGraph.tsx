import React from "react";
import { Pane } from "evergreen-ui";

import dynamic from "next/dynamic";

const TaslGraph = dynamic(
	async () => {
		const { TaslGraph } = await import("@underlay/tasl-cytoscape");
		return TaslGraph;
	},
	{ ssr: false }
);

import styles from "./SchemaGraph.module.scss";
import { APG } from "@underlay/apg";

export interface SchemaGraphProps {
	schema: APG.Schema;
	namespaces: Record<string, string>;
	errorUnit?: APG.Unit;
}

const SchemaGraph = (props: SchemaGraphProps) => {
	return (
		<Pane className={styles.graph} border="default">
			<TaslGraph {...props} />
		</Pane>
	);
};

export default SchemaGraph;
