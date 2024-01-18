"use client";

import { IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { RouterOutputs } from "@/trpc/shared";

import { useLayoutStore } from "@/store/layout";

import { Logo } from "./logo";
import { Button } from "../ui/button";
import { NotesPanel } from "./notes-panel";
import { NewNoteButton } from "./new-page-button";
import { Sheet, SheetContent } from "../ui/sheet";

interface Props {
	notes: RouterOutputs["notes"]["getAll"];
}

export const NoteSidebar = ({ notes }: Props) => {
	const { isSideBarOpen, isDrawerOpen, toggleDrawer } = useLayoutStore();

	return (
		<>
			<aside
				className={cn(
					"fixed z-50 inset-0 -left-80 lg:left-0 flex flex-col transition-all duration-500 transform w-80 border-r",
					isSideBarOpen ? "translate-x-0" : "-translate-x-full"
				)}
			>
				<Logo />
				<NotesPanel notes={notes} />
				<NewNoteButton />
			</aside>
			{/* Drawer */}
			<Sheet open={isDrawerOpen} onOpenChange={toggleDrawer}>
				<SheetContent side="left" className="p-0 overflow-y-scroll">
					<div className="flex flex-col absolute inset-0">
						<div className="flex items-center justify-between px-2">
							<Logo onClose={toggleDrawer} />
							<Button variant="outline" onClick={toggleDrawer}>
								<IconX size={18} />
							</Button>
						</div>
						<NotesPanel notes={notes} onClose={toggleDrawer} />
						<NewNoteButton />
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};
