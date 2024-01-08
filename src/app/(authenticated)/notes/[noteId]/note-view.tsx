"use client";

import { Editor as EditorClass, JSONContent } from "@tiptap/core";

import { api } from "@/trpc/react";
import { RouterOutputs } from "@/trpc/shared";

import { Editor } from "@/components/editor";
import { NoteNavbar } from "@/components/note-navbar";

interface Props {
	initialData: RouterOutputs["notes"]["get"];
}

export const NoteView = ({ initialData }: Props) => {
	const utils = api.useUtils();

	const noteQuery = api.notes.get.useQuery(initialData.note.id, {
		initialData,
	});

	const updateNoteMutation = api.notes.update.useMutation({
		onError: (e) => {},
		onSuccess: (data) => {
			utils.notes.get.setData(note.id, (state) => {
				if (state) {
					return {
						...state,
						note: data,
					};
				}
				return undefined;
			});

			utils.notes.getAll.setData(undefined, (state) =>
				state?.map((note) => (note.id === data.id ? data : note))
			);
		},
	});

	const { note } = noteQuery.data;

	const onUpdate = (editor?: EditorClass) => {
		const data = editor?.getJSON();
		if (data) {
			const updatedTitle = data.content?.[0].content?.[0].text;
			const updatedContent = data.content?.splice(1);
			updateNoteMutation.mutate({
				id: note.id,
				title: updatedTitle ?? null,
				content: JSON.stringify(updatedContent),
			});
		}
	};

	const content: JSONContent = {
		type: "doc",
		content: [
			{
				type: "title",
				content: [{ type: "text", text: note.title ?? "" }],
			},
		],
	};

	if (note.content) {
		content.content?.push(...JSON.parse(note.content));
	}

	return (
		<div className="w-full">
			<NoteNavbar noteId={note.id} isSaving={updateNoteMutation.isLoading} />
			<div className="max-w-3xl mx-auto p-4 lg:py-12">
				<div className="prose prose-stone prose-sm lg:prose-lg dark:prose-invert prose-pre:border">
					<Editor defaultValue={content} onDebouncedUpdate={onUpdate} />
				</div>
			</div>
		</div>
	);
};
