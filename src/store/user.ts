import { createStore } from "zustand";

import { User } from "@/types/users";

interface UserProps {
	user: User;
}

export interface UserState extends UserProps {
	setUser: (user: User) => void;
}

export type UserStore = ReturnType<typeof createUserStore>;

export const createUserStore = (initProps: UserProps) => {
	return createStore<UserState>()((set) => ({
		...initProps,
		setUser: (user) => set(() => ({ user })),
	}));
};
