import { PropsWithChildren } from "react";
import { TRPCError } from "@trpc/server";
import { redirect } from "next/navigation";

import { api } from "@/trpc/server";

import { Providers } from "./providers";
import { NotesLayoutView } from "./notes-layout-view";
import { TRPCClientError } from "@trpc/client";

export default async function NotesLayout(props: PropsWithChildren) {
	try {
		const [user, notes] = await Promise.all([
			api.user.me.query(),
			api.notes.getAll.query(),
		]);
		return (
			<Providers data={user}>
				<NotesLayoutView data={notes}>{props.children}</NotesLayoutView>
			</Providers>
		);
	} catch (e) {
		if (e instanceof TRPCClientError) {
			switch (e.message) {
				case "UNAUTHORIZED": {
					return redirect("/sign-in");
				}
				case "FORBIDDEN": {
					return redirect("/verify-email");
				}
			}
		}
		throw new Error("Unknown error occured!");
	}
}
