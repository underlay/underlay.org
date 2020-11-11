import React, { useContext } from "react";
import { PageData } from "utils/shared/session";

export const PageContext = React.createContext<PageData>({ session: null });

export const usePageContext = (): PageData => {
	return useContext(PageContext);
};
