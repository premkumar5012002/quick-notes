"use client";

import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { useLayoutStore } from "@/store/layout";

import { NoteSidebar } from "@/components/note-sidebar";

interface Props extends PropsWithChildren {
	data: RouterOutputs["notes"]["getAll"];
}

export const NotesLayoutView = ({ data, children }: Props) => {
	const { isSideBarOpen } = useLayoutStore();

	const allNotesQuery = api.notes.getAll.useQuery(undefined, {
		initialData: data,
	});

	return (
		<div>
			<NoteSidebar notes={allNotesQuery.data} />
			<div
				className={cn(
					"relative transition-all duration-500 transform",
					isSideBarOpen && "lg:pl-80"
				)}
			>
				{children}
			</div>
		</div>
	);
};
