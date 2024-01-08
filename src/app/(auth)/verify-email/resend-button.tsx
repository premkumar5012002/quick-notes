"use client";

import { api } from "@/trpc/react";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/loading-button";

export const ResendButton = () => {
	const { toast } = useToast();

	const { isLoading, mutate } = api.auth.resendVerificationEmail.useMutation({
		onError: (e) => {
			toast({ variant: "destructive", description: e.message });
		},
	});

	return isLoading ? (
		<ButtonLoading />
	) : (
		<Button onClick={() => mutate()}>Resend email</Button>
	);
};
