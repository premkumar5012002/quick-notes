import { TRPCClientError } from "@trpc/client";
import { notFound, redirect } from "next/navigation";

import { api } from "@/trpc/server";

import { NoteView } from "./note-view";

interface Params {
	params: {
		noteId: string;
	};
}

export default async function page({ params }: Params) {
	try {
		const data = await api.notes.get.query(params.noteId);
		return <NoteView initialData={data} />;
	} catch (e) {
		if (e instanceof TRPCClientError) {
			switch (e.message) {
				case "UNAUTHORIZED": {
					return redirect("/sign-in");
				}
				case "FORBIDDEN": {
					return redirect("/verify-email");
				}
				case "NOT_FOUND": {
					return notFound();
				}
			}
		}
		throw new Error("Unknown error occured!");
	}
}
