import { Node, mergeAttributes } from "@tiptap/core";

export const TitleNode = Node.create({
	name: "title",

	content: "inline*",

	group: "block",

	defining: true,

	parseHTML() {
		return [{ tag: "h1" }];
	},

	renderHTML({ HTMLAttributes }) {
		return ["h1", mergeAttributes(HTMLAttributes, { id: "title" }), 0];
	},
});
