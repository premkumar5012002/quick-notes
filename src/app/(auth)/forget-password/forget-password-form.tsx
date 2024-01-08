"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ButtonLoading } from "@/components/loading-button";

export const ForgetPasswordSchema = z.object({
	email: z.string().email("Please provide a valid email address"),
});

export const ForgetPasswordForm = () => {
	const { toast } = useToast();

	const { isLoading, mutate } = api.auth.forgetPassword.useMutation({
		onError: (e) => {
			toast({
				variant: "destructive",
				description: e.message,
			});
		},
		onSuccess: () => {
			reset();
			toast({
				description:
					"An reset password link has been sent to your email address to reset password",
			});
		},
	});

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof ForgetPasswordSchema>>({
		resolver: zodResolver(ForgetPasswordSchema),
	});

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

	return (
		<form className="flex flex-col gap-5" onSubmit={onSubmit}>
			<div className="flex flex-col gap-3">
				<p className="text-center text-default-500 tracking-wide">
					We will send you a link where you can change your password.
				</p>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						placeholder="Email"
						{...register("email")}
						className={cn(
							errors.email &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					{errors.email && (
						<span className="text-sm text-destructive">
							{errors.email.message}
						</span>
					)}
				</div>
				<div className="pt-4">
					{isLoading ? (
						<ButtonLoading className="w-full" />
					) : (
						<Button type="submit" className="w-full">
							Submit
						</Button>
					)}
				</div>
			</div>
		</form>
	);
};
