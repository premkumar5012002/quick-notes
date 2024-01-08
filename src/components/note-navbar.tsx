"use client";

import {
	IconTrash,
	IconLoader2,
	IconLayoutSidebarLeftCollapse,
	IconLayoutSidebarRightCollapse,
	IconMenu2,
} from "@tabler/icons-react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { useLayoutStore } from "@/store/layout";

import {
	Dialog,
	DialogTitle,
	DialogFooter,
	DialogHeader,
	DialogContent,
	DialogTrigger,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const NoteNavbar: FC<{ noteId?: string; isSaving?: boolean }> = ({
	noteId,
	isSaving = false,
}) => {
	const sideBarStore = useLayoutStore();
	return (
		<nav className="flex items-center justify-between py-2 px-3">
			<div>
				{/* Sidebar Collapse Button */}
				<Button
					size="icon"
					variant="ghost"
					onClick={sideBarStore.toggleSidebar}
					className={cn(
						"hidden lg:flex transition-all duration-500 transform",
						sideBarStore.isSideBarOpen ? "rotate-0" : "rotate-180"
					)}
				>
					<IconLayoutSidebarLeftCollapse size={22} />
				</Button>
				{/* Drawer Menu Button */}
				<Button
					size="icon"
					variant="ghost"
					onClick={sideBarStore.toggleDrawer}
					className="flex lg:hidden"
				>
					<IconMenu2 size={22} />
				</Button>
			</div>
			{noteId && <NoteOptions noteId={noteId} isSaving={isSaving} />}
		</nav>
	);
};

const NoteOptions: FC<{ noteId: string; isSaving: boolean }> = ({
	noteId,
	isSaving,
}) => {
	const router = useRouter();

	const utils = api.useUtils();

	const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = useState(false);

	const { isLoading, mutate } = api.notes.delete.useMutation({
		onError: (e) => {},
		onSuccess: async () => {
			toggleDeleteNoteDialog();
			router.replace("/notes");
			utils.notes.getAll.setData(undefined, (state) => {
				return state?.filter((note) => note.id !== noteId);
			});
		},
	});

	const toggleDeleteNoteDialog = () => {
		setIsDeleteNoteDialogOpen((state) => !state);
	};

	return (
		<div className="flex items-center gap-3.5">
			{/* Saving Indicator */}
			{isSaving && (
				<div className="flex items-center text-muted-foreground text-sm">
					<IconLoader2 className="mr-1.5 animate-spin" size={20} /> Saving...
				</div>
			)}
			{/* Delete Note */}
			<Dialog
				open={isDeleteNoteDialogOpen}
				onOpenChange={toggleDeleteNoteDialog}
			>
				<DialogTrigger asChild>
					<Button size="icon" variant="ghost">
						<IconTrash size={22} />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							note and remove it from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						{isLoading ? (
							<Button disabled>
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								Please wait
							</Button>
						) : (
							<Button variant="destructive" onClick={() => mutate(noteId)}>
								Yes, delete it
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
