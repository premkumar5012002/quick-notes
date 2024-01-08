"use client";

import { FC, PropsWithChildren, useRef } from "react";

import { RouterOutputs } from "@/trpc/shared";

import { createUserStore } from "@/store/user";

import { UserContext } from "@/context/user";

interface ProvidersProps extends PropsWithChildren {
	data: RouterOutputs["user"]["me"];
}

export const Providers: FC<ProvidersProps> = ({ data, children }) => {
	const user = data;

	const userStore = useRef(createUserStore({ user })).current;

	return (
		<UserContext.Provider value={userStore}>{children}</UserContext.Provider>
	);
};
