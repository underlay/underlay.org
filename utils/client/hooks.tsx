import React, { useContext } from "react";
import { LocalUserData, LocationData } from "utils/shared/types";

export const LoginContext = React.createContext<LocalUserData>(undefined);
export const useLoginContext = (): LocalUserData => useContext(LoginContext);

export const LocationContext = React.createContext<LocationData>({ pathname: "", query: {} });
export const useLocationContext = (): LocationData => useContext(LocationContext);
