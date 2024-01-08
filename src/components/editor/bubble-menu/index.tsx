import { BubbleMenu, BubbleMenuProps, isNodeSelection } from "@tiptap/react";
import { FC, useState } from "react";
import {
	BoldIcon,
	ItalicIcon,
	UnderlineIcon,
	StrikethroughIcon,
	CodeIcon,
} from "lucide-react";
import { NodeSelector } from "./node-selector";
import { ColorSelector } from "./color-selector";
import { LinkSelector } from "./link-selector";
import { cn } from "@/lib/utils";

export interface BubbleMenuItem {
	name: string;
	isActive: () => boolean;
	command: () => void;
	icon: typeof BoldIcon;
}

type EditorBubbleMenuProps = Omit<BubbleMenuProps, "children">;

export const EditorBubbleMenu: FC<EditorBubbleMenuProps> = (props) => {
	const editor = props.editor!;

	const items: BubbleMenuItem[] = [
		{
			name: "bold",
			isActive: () => editor.isActive("bold"),
			command: () => editor.chain().focus().toggleBold().run(),
			icon: BoldIcon,
		},
		{
			name: "italic",
			isActive: () => editor.isActive("italic"),
			command: () => editor.chain().focus().toggleItalic().run(),
			icon: ItalicIcon,
		},
		{
			name: "underline",
			isActive: () => editor.isActive("underline"),
			command: () => editor.chain().focus().toggleUnderline().run(),
			icon: UnderlineIcon,
		},
		{
			name: "strike",
			isActive: () => editor.isActive("strike"),
			command: () => editor.chain().focus().toggleStrike().run(),
			icon: StrikethroughIcon,
		},
		{
			name: "code",
			isActive: () => editor.isActive("code"),
			command: () => editor.chain().focus().toggleCode().run(),
			icon: CodeIcon,
		},
	];

	const bubbleMenuProps: EditorBubbleMenuProps = {
		...props,
		shouldShow: ({ state, editor }) => {
			const { selection } = state;
			const { empty } = selection;

			// don't show bubble menu if:
			// - the selected node is an image
			// - the selection is empty
			// - the selection is a node selection (for drag handles)
			if (
				editor.isActive("image") ||
				editor.isActive("title") ||
				empty ||
				isNodeSelection(selection)
			) {
				return false;
			}
			return true;
		},
		tippyOptions: {
			moveTransition: "transform 0.15s ease-out",
			onHidden: () => {
				setIsNodeSelectorOpen(false);
				setIsColorSelectorOpen(false);
				setIsLinkSelectorOpen(false);
			},
		},
	};

	const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
	const [isColorSelectorOpen, setIsColorSelectorOpen] = useState(false);
	const [isLinkSelectorOpen, setIsLinkSelectorOpen] = useState(false);

	return (
		<BubbleMenu
			{...bubbleMenuProps}
			className="not-prose flex w-fit divide-x divide-border rounded border border-border bg-background shadow-xl"
		>
			<NodeSelector
				editor={editor}
				isOpen={isNodeSelectorOpen}
				setIsOpen={() => {
					setIsNodeSelectorOpen(!isNodeSelectorOpen);
					setIsColorSelectorOpen(false);
					setIsLinkSelectorOpen(false);
				}}
			/>
			<LinkSelector
				editor={editor}
				isOpen={isLinkSelectorOpen}
				setIsOpen={() => {
					setIsLinkSelectorOpen(!isLinkSelectorOpen);
					setIsColorSelectorOpen(false);
					setIsNodeSelectorOpen(false);
				}}
			/>
			<div className="flex">
				{items.map((item, index) => (
					<button
						key={index}
						onClick={item.command}
						className="p-2 text-muted-foreground hover:bg-muted"
						type="button"
					>
						<item.icon
							className={cn("h-4 w-4", {
								"text-blue-500": item.isActive(),
							})}
						/>
					</button>
				))}
			</div>
			<ColorSelector
				editor={editor}
				isOpen={isColorSelectorOpen}
				setIsOpen={() => {
					setIsColorSelectorOpen(!isColorSelectorOpen);
					setIsNodeSelectorOpen(false);
					setIsLinkSelectorOpen(false);
				}}
			/>
		</BubbleMenu>
	);
};
