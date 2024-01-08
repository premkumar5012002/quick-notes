"use client";

import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex flex-col gap-6 justify-center items-center py-10">
			<h2 className="text-4xl font-bold">
				{error.message ?? "Something went wrong!"}
			</h2>
			<Button onClick={() => reset()}>Try again</Button>
		</div>
	);
}
