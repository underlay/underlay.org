import React, { useContext } from "react";
import { InitData } from "utils/server/initData";

export const PageContext = React.createContext<InitData>({
	session: null,
});

export const usePageContext = (): InitData => {
	return useContext(PageContext);
};
