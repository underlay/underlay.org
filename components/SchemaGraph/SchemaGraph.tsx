import React from "react";
import { BoxOwnProps, Pane, PaneOwnProps } from "evergreen-ui";

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

import { errorUnit } from "@underlay/tasl-codemirror/lib/error";

export interface SchemaGraphProps {
	schema: APG.Schema | null;
	namespaces: Record<string, string>;
}

const SchemaGraph = ({
	schema,
	namespaces,
	...rest
}: SchemaGraphProps & BoxOwnProps<"div", PaneOwnProps>) => {
	return (
		<Pane className={styles.graph} border="default" {...rest}>
			<TaslGraph
				schema={schema}
				namespaces={namespaces}
				layoutOptions={{ fit: true, padding: 40 }}
				errorUnit={errorUnit}
			/>
		</Pane>
	);
};

export default SchemaGraph;
