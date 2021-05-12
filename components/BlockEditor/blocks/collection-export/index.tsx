import { Editor } from "../../editor";

import type { State } from "@underlay/pipeline/collection-export";
import { Heading, majorScale, Pane } from "evergreen-ui";
import React, { useCallback, useRef } from "react";
import { ReadmeEditor } from "components";

import CollectionTargets from "./CollectionTargets";

const CollectionExportEditor: Editor<State> = {
	component: ({ id, state, setState }) => {
		const stateRef = useRef(state);
		stateRef.current = state;

		const handleReadmeUpdate = useCallback((value: string) => {
			if (value !== stateRef.current.readme) {
				setState(id, { readme: value });
			}
		}, []);

		const handleTargetUpdate = useCallback(
			(target: string | null) => setState(id, { id: target }),
			[]
		);

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
