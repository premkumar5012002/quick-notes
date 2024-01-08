"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ButtonLoading } from "@/components/loading-button";

export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: "Password must be mininum 8 characters" })
			.max(256, { message: "Password should not exceed 256 characters" }),
		confirmPassword: z.string(),
	})
	.refine(
		(values) => {
			return values.password === values.confirmPassword;
		},
		{
			message: "Passwords must match!",
			path: ["confirmPassword"],
		}
	);

export const ResetPasswordForm = ({ token }: { token: string }) => {
	const router = useRouter();

	const { toast } = useToast();

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	const { isLoading, mutate } = api.auth.resetPassword.useMutation({
		onError: (e) => {
			toast({ variant: "destructive", description: e.message });
		},
		onSuccess: () => {
			toast({ description: "Password reset successfully" });
			router.push("/sign-in");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
	});

	const onSubmit = handleSubmit((data) => {
		mutate({ ...data, token });
	});

	const togglePasswordVisibility = () =>
		setIsPasswordVisible((state) => !state);

	const toggleConfirmPasswordVisibility = () =>
		setIsConfirmPasswordVisible((state) => !state);

	return (
		<form className="text-left space-y-8" onSubmit={onSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor="password">New password</Label>
				<div className="relative">
					<Input
						{...register("password")}
						placeholder="Enter your new password"
						type={isPasswordVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.password &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={togglePasswordVisibility}>
							{isPasswordVisible ? (
								<IconEye size={20} />
							) : (
								<IconEyeOff size={20} />
							)}
						</button>
					</div>
				</div>
				{errors.password && (
					<span className="text-sm text-destructive">
						{errors.password.message}
					</span>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Confirm new password</Label>
				<div className="relative">
					<Input
						placeholder="Re-enter your new password"
						{...register("confirmPassword")}
						type={isConfirmPasswordVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.confirmPassword &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={toggleConfirmPasswordVisibility}>
							{isConfirmPasswordVisible ? (
								<IconEye size={20} />
							) : (
								<IconEyeOff size={20} />
							)}
						</button>
					</div>
				</div>
				{errors.confirmPassword && (
					<span className="text-sm text-destructive">
						{errors.confirmPassword.message}
					</span>
				)}
			</div>

			{isLoading ? (
				<ButtonLoading className="w-full" />
			) : (
				<Button type="submit" className="w-full">
					Reset password
				</Button>
			)}
		</form>
	);
};
