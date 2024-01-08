"use client";

import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ButtonLoading } from "@/components/loading-button";

export const SignInSchema = z.object({
	email: z.string().email("Please provide a valid email address"),
	password: z.string().min(1, { message: "Password cannot be empty" }),
});

export const SignInForm = () => {
	const router = useRouter();

	const { toast } = useToast();

	const searchParams = useSearchParams();

	const [isVisible, setIsVisible] = useState(false);

	const redirect = searchParams.get("r");

	const { isLoading, mutate } = api.auth.signIn.useMutation({
		onError: (e) => {
			toast({
				variant: "destructive",
				description: e.message,
			});
		},
		onSuccess: (data) => {
			if (data.result === "SUCCESS") {
				router.replace(redirect ? decodeURIComponent(redirect) : "/notes");
			} else {
				router.replace("/verify-email");
			}
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof SignInSchema>>({
		resolver: zodResolver(SignInSchema),
	});

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<form className="flex flex-col gap-5" onSubmit={onSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor="email">Email</Label>
				<Input
					type="email"
					placeholder="Email"
					{...register("email")}
					className={cn(
						errors.email && "border-destructive focus-visible:ring-destructive"
					)}
				/>
				{errors.email && (
					<span className="text-sm text-destructive">
						{errors.email.message}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Password</Label>
				<div className="relative">
					<Input
						placeholder="Password"
						{...register("password")}
						type={isVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.password &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={toggleVisibility}>
							{isVisible ? <IconEye size={20} /> : <IconEyeOff size={20} />}
						</button>
					</div>
				</div>
				{errors.password && (
					<span className="text-sm text-destructive">
						{errors.password.message}
					</span>
				)}
			</div>

			<div className="flex items-center justify-end">
				<Button asChild variant="ghost">
					<Link href="/forget-password">Forget password?</Link>
				</Button>
			</div>

			<div className="pt-4">
				{isLoading ? (
					<ButtonLoading className="w-full" />
				) : (
					<Button type="submit" className="w-full">
						Sign in
					</Button>
				)}
			</div>
		</form>
	);
};
