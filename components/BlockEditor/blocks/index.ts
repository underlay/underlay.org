import type { Blocks } from "@underlay/pipeline";

import type { Editor } from "../editor";

import CsvImport from "./csv-import";
import CollectionExport from "./collection-export";

export type Editors = {
	[k in keyof Blocks]: Editor<Blocks[k]["state"]>;
};

export const editors: Editors = {
	"csv-import": CsvImport,
	"collection-export": CollectionExport,
};
