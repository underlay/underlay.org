import React from "react";
import type { JsonObject } from "@underlay/pipeline";

export interface Editor<State extends JsonObject> {
	component: React.FC<{
		id: string;
		state: State;
		setState: (state: Partial<State>) => void;
	}>;
}
