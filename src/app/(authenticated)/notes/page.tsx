import { NoteNavbar } from "@/components/note-navbar";
import { IconNotebook } from "@tabler/icons-react";

export default function Notes() {
	return (
		<div>
			<NoteNavbar />
			<div className="py-20 flex flex-col items-center justify-center gap-6">
				<div className="flex items-center justify-center w-32 h-32 bg-primary-foreground rounded-full">
					<IconNotebook className="text-primary" size={75} />
				</div>
				<div className="text-center space-y-1.5">
					<h2 className="text-3xl font-bold">No Note Selected</h2>
					<p className="font-medium text-muted-foreground">
						Create a New Note or Choose from Existing Notes.
					</p>
				</div>
			</div>
		</div>
	);
}
