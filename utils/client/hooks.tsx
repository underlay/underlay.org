import React, { useContext } from "react";
import { InitData } from "pages/api/init";

export const PageContext = React.createContext<InitData>({});

export const usePageContext = (): InitData => {
	return useContext(PageContext);
};
