import { Editor } from "../../editor";

import type { State } from "@underlay/pipeline/collection-export";
import { Heading, majorScale, Pane } from "evergreen-ui";
import React, { useCallback } from "react";
import { ReadmeEditor } from "components";

import CollectionTargets from "./CollectionTargets";

const CollectionExportEditor: Editor<State> = {
	component: ({ state, setState }) => {
		const handleReadmeUpdate = useCallback(
			(value: string) => {
				if (value !== state.readme) {
					setState({ readme: value });
				}
			},
			[state.readme, setState]
		);

		const handleTargetUpdate = useCallback((id: string | null) => setState({ id }), [setState]);

		return (
			<>
				<Heading>Target</Heading>
				<Pane marginY={majorScale(2)}>
					<CollectionTargets id={state.id} onChange={handleTargetUpdate} />
				</Pane>
				<Heading>README</Heading>
				<Pane marginY={majorScale(2)} border>
					<ReadmeEditor initialValue={state.readme} onChange={handleReadmeUpdate} />
				</Pane>
			</>
		);
	},
};

export default CollectionExportEditor;
