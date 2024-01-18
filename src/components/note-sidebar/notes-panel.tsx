import Link from "next/link";
import { useParams } from "next/navigation";
import { IconFileText } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Note } from "@/types/notes";
import { RouterOutputs } from "@/trpc/shared";

import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

interface Props {
	notes: RouterOutputs["notes"]["getAll"];
	onClose?: () => void;
}

export const NotesPanel = ({ notes, onClose }: Props) => {
	return (
		<ScrollArea className="flex-1 border-t border-b">
			<div className="p-2 space-y-1.5">
				{notes.map((note) => (
					<NotePanel key={note.id} note={note} onClose={onClose} />
				))}
			</div>
		</ScrollArea>
	);
};

interface NotePanelProps {
	note: Note;
	onClose?: () => void;
}

const NotePanel = ({ note, onClose }: NotePanelProps) => {
	const params = useParams();

	const isCurrentNote = params.noteId === note.id;

	return (
		<Button
			asChild
			variant={isCurrentNote ? "secondary" : "ghost"}
			className={cn(
				"w-full justify-between",
				isCurrentNote ? "text-secondary-foreground" : "text-muted-foreground"
			)}
		>
			<Link href={`/notes/${note.id}`} onClick={onClose}>
				<div className="flex items-center truncate">
					<IconFileText size={20} className="absolute" />
					<p className="truncate w-64 text-sm pl-6">{note.title ?? "Untitled"}</p>
				</div>
			</Link>
		</Button>
	);
};
