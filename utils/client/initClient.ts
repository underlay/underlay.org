import { FocusStyleManager } from "@blueprintjs/core";

export default function initClient() {
	if (typeof window !== "undefined") {
		FocusStyleManager.onlyShowFocusOnTabs();
	}
}
