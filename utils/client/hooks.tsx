import React, { useContext, useMemo, useRef, useState } from "react";
import { PageData } from "utils/shared/session";
import { LocationData } from "utils/shared/urls";

export const PageContext = React.createContext<PageData>({ session: null });
export const usePageContext = (): PageData => useContext(PageContext);

export const LocationContext = React.createContext<LocationData>({});
export const useLocationContext = (): LocationData => useContext(LocationContext);

export type CollectionTarget = {
	slug: string;
	id: string;
	lastVersion: { id: string; versionNumber: string } | null;
};

export type CollectionTargets = {
	profileSlug: string;
	targets: CollectionTarget[];
};

export const CollectionTargetContext = React.createContext<CollectionTargets>({
	profileSlug: "",
	targets: [],
});

export const useCollectionTargetContext = (): CollectionTargets =>
	useContext(CollectionTargetContext);

// useStateRef works exactly like useState, except it also gives you a
// MutableRefObject that holds the current value. This is useful when
// you want to read state from a callback that you don't want to keep
// redefining (e.g. because you're passing it as a prop into a child,
// and you don't want it to change and make the child render)
export function useStateRef<T>(
	initialValue: T
): [T, (value: T) => void, Readonly<React.MutableRefObject<T>>] {
	const [value, setValue] = useState(initialValue);
	const ref = useRef(value);
	ref.current = value;
	return [value, setValue, ref];
}

export function useMemoRef<T>(factory: () => T, deps?: React.DependencyList) {
	const value = useMemo<T>(factory, deps);
	const ref = useRef<T>(value);
	ref.current = value;
	return [value, ref];
}
