import React, { useContext } from "react";
import { InitData } from "pages/api/init";

export const PageContext = React.createContext<InitData | null>(null);

export const usePageContext = (previewContextObject?: InitData): InitData => {
	const contextObject = useContext(PageContext);
	return previewContextObject || contextObject;
};
