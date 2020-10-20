import React, { useContext } from "react";
import { InitData } from "utils/server/initData";

export const PageContext = React.createContext<InitData>({
	sessionData: {},
	locationData: { query: {} },
});

export const usePageContext = (): InitData => {
	return useContext(PageContext);
};
