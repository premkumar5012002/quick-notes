import { useContext } from "react";
import { useStore } from "zustand";

import { UserState } from "@/store/user";

import { UserContext } from "@/context/user";

export function useUserContext<T>(selector: (state: UserState) => T): T {
	const store = useContext(UserContext);
	if (!store) throw new Error("Missing UserContext.Provider in the tree");
	return useStore(store, selector);
}
