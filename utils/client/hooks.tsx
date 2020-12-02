import React, { useContext } from "react";
import { PageData } from "utils/shared/session";
import { LocationData } from "utils/shared/urls";

export const PageContext = React.createContext<PageData>({ session: null });
export const usePageContext = (): PageData => useContext(PageContext);

export const LocationContext = React.createContext<LocationData>({});
export const useLocationContext = (): LocationData => useContext(LocationContext);
