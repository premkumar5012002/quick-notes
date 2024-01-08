import StarterKit from "@tiptap/starter-kit";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TiptapLink from "@tiptap/extension-link";
import Document from "@tiptap/extension-document";
import TiptapUnderline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { Markdown } from "tiptap-markdown";
import Highlight from "@tiptap/extension-highlight";
import { InputRule } from "@tiptap/core";

import CustomKeymap from "./custom-keymap";
import DragAndDrop from "./drag-and-drop";
import SlashCommand from "./slash-command";
import { Placeholder } from "./PlaceHolder";
import { TitleNode } from "./TitleNode";

export const defaultExtensions = [
	StarterKit.configure({
		horizontalRule: false,
	}),
	// patch to fix horizontal rule bug: https://github.com/ueberdosis/tiptap/pull/3859#issuecomment-1536799740
	HorizontalRule.extend({
		addInputRules() {
			return [
				new InputRule({
					find: /^(?:---|—-|___\s|\*\*\*\s)$/,
					handler: ({ state, range }) => {
						const attributes = {};

						const { tr } = state;
						const start = range.from;
						let end = range.to;

						tr.insert(start - 1, this.type.create(attributes)).delete(
							tr.mapping.map(start),
							tr.mapping.map(end)
						);
					},
				}),
			];
		},
	}).configure({
		HTMLAttributes: {
			class: "mt-4 mb-6 border-t border-border",
		},
	}),
	Document.extend({
		content: "title block*",
	}),
	TiptapLink,
	SlashCommand,
	TiptapUnderline,
	TextStyle,
	Color,
	Highlight.configure({
		multicolor: true,
	}),
	TaskList.configure({
		HTMLAttributes: {
			class: "not-prose pl-2",
		},
	}),
	TaskItem.configure({
		HTMLAttributes: {
			class: "flex items-start my-4 space-x-2",
		},
		nested: true,
	}),
	Markdown.configure({
		html: false,
		transformCopiedText: true,
		transformPastedText: true,
	}),
	TitleNode,
	CustomKeymap,
	DragAndDrop,
	Placeholder.configure({
		placeholder: ({ node }) => {
			if (node.type.name === "title") {
				return "Untited";
			}

			if (node.type.name === "heading") {
				return `Heading ${node.attrs.level}`;
			}

			return "Press '/' for commands";
		},
	}),
];
