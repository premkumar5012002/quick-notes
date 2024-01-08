import { useRouter } from "next/navigation";
import { IconCirclePlus } from "@tabler/icons-react";

import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";

export const NewNoteButton = () => {
	const router = useRouter();

	const utils = api.useUtils();

	const newNoteMutation = api.notes.new.useMutation({
		onError: (e) => {},
		onSuccess: async (data) => {
			router.push(`/notes/${data.id}`);
			utils.notes.getAll.setData(undefined, (state) => state?.concat(data));
		},
	});

	return (
		<div className="p-2">
			<Button
				variant="ghost"
				className="w-full justify-start"
				onClick={() => newNoteMutation.mutate()}
			>
				<IconCirclePlus size={18} className="mr-2" /> New Note
			</Button>
		</div>
	);
};
