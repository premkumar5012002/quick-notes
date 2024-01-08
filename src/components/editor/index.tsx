"use client";

import { useEffect, useState } from "react";
import { EditorProps } from "@tiptap/pm/view";
import { useDebouncedCallback } from "use-debounce";
import { Editor as EditorClass, Extensions } from "@tiptap/core";
import { useEditor, EditorContent, JSONContent } from "@tiptap/react";

import { defaultEditorProps } from "./props";
import { EditorBubbleMenu } from "./bubble-menu";
import { defaultExtensions } from "./extensions";

export function Editor({
	className = "relative w-full max-w-screen-lg bg-background",
	defaultValue,
	extensions = [],
	editorProps = {},
	onUpdate = () => {},
	onDebouncedUpdate = () => {},
	debounceDuration = 750,
}: {
	/**
	 * Additional classes to add to the editor container.
	 * Defaults to "relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg".
	 */
	className?: string;
	/**
	 * The default value to use for the editor.
	 * Defaults to defaultEditorContent.
	 */
	defaultValue?: JSONContent | string;
	/**
	 * A list of extensions to use for the editor, in addition to the default Novel extensions.
	 * Defaults to [].
	 */
	extensions?: Extensions;
	/**
	 * Props to pass to the underlying Tiptap editor, in addition to the default Novel editor props.
	 * Defaults to {}.
	 */
	editorProps?: EditorProps;
	/**
	 * A callback function that is called whenever the editor is updated.
	 * Defaults to () => {}.
	 */
	// eslint-disable-next-line no-unused-vars
	onUpdate?: (editor?: EditorClass) => void | Promise<void>;
	/**
	 * A callback function that is called whenever the editor is updated, but only after the defined debounce duration.
	 * Defaults to () => {}.
	 */
	// eslint-disable-next-line no-unused-vars
	onDebouncedUpdate?: (editor?: EditorClass) => void | Promise<void>;
	/**
	 * The duration (in milliseconds) to debounce the onDebouncedUpdate callback.
	 * Defaults to 750.
	 */
	debounceDuration?: number;
}) {
	const [hydrated, setHydrated] = useState(false);

	const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
		onDebouncedUpdate(editor);
	}, debounceDuration);

	const editor = useEditor({
		extensions: [...defaultExtensions, ...extensions],
		editorProps: {
			...defaultEditorProps,
			...editorProps,
		},
		onUpdate: (e) => {
			onUpdate(e.editor);
			debouncedUpdates(e);
		},
		autofocus: "end",
	});

	useEffect(() => {
		if (!editor || hydrated) return;

		const value = defaultValue;

		if (value) {
			editor.commands.setContent(value);
			setHydrated(true);
		}
	}, [editor, defaultValue, hydrated]);

	return (
		<div
			onClick={() => {
				editor?.chain().focus().run();
			}}
			className={className}
		>
			{editor && <EditorBubbleMenu editor={editor} />}
			<EditorContent editor={editor} />
		</div>
	);
}
