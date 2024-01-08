import { EditorProps } from "@tiptap/pm/view";

export const defaultEditorProps: EditorProps = {
	attributes: {
		class: `prose-lg prose-stone dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
	},
	handleDOMEvents: {
		keydown: (_view, event) => {
			// prevent default event listeners from firing when slash command is active
			if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
				const slashCommand = document.querySelector("#slash-command");
				if (slashCommand) {
					return true;
				}
			}
		},
	},
	handlePaste: (view, event) => {
		if (
			event.clipboardData &&
			event.clipboardData.files &&
			event.clipboardData.files[0]
		) {
			event.preventDefault();
			return true;
		}
		return false;
	},
	handleDrop: (view, event, _slice, moved) => {
		if (
			!moved &&
			event.dataTransfer &&
			event.dataTransfer.files &&
			event.dataTransfer.files[0]
		) {
			event.preventDefault();
			return true;
		}
		return false;
	},
};
