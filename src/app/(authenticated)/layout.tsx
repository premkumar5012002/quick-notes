import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { TRPCClientError } from "@trpc/client";

import { api } from "@/trpc/server";

import { Providers } from "./providers";
import { NotesLayoutView } from "./notes-layout-view";

export const dynamic = "force-dynamic";

const getData = async () => {
	const [user, notes] = await Promise.all([
		api.user.me.query(),
		api.notes.getAll.query(),
	]);
	return { user, notes };
};

export default async function NotesLayout(props: PropsWithChildren) {
	try {
		const { user, notes } = await getData();
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
