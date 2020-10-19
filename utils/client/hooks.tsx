import React, { useContext } from "react";
import { InitData } from "utils/server/initData";

export const PageContext = React.createContext<InitData>({ sessionData: {}, locationData: {} });

export const usePageContext = (): InitData => {
	return useContext(PageContext);
};
