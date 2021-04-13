import React from "react";
import { Pane } from "evergreen-ui";

import { Editor } from "../../editor";

import type { State } from "@underlay/pipeline/collection-import";

const CollectionImportEditor: Editor<State> = {
	component({}) {
		return <Pane>Hello I'm a Collection Importer</Pane>;
	},
};

export default CollectionImportEditor;
