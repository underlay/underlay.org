import React, { useContext } from "react";
import { LoginData, LocationData } from "utils/shared/types";

export const LoginContext = React.createContext<LoginData>(undefined);
export const useLoginContext = (): LoginData => useContext(LoginContext);

export const LocationContext = React.createContext<LocationData>({});
export const useLocationContext = (): LocationData => useContext(LocationContext);