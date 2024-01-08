"use client";

import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/loading-button";

export const LogoutButton = () => {
	const router = useRouter();

	const { toast } = useToast();

	const { isLoading, mutate } = api.auth.logout.useMutation({
		onError: (e) => {
			toast({ variant: "destructive", description: e.message });
		},
		onSuccess: () => {
			router.replace("/sign-in");
		},
	});

	return isLoading ? (
		<ButtonLoading />
	) : (
		<Button variant="secondary" onClick={() => mutate()}>
			Logout
		</Button>
	);
};
