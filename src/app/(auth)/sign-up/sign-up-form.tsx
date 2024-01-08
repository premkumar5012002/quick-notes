"use client";

import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ButtonLoading } from "@/components/loading-button";

export const SignUpSchema = z.object({
	fullName: z
		.string()
		.min(1, "Full name can't be empty")
		.max(128, "Full name can't exceed 128 characters"),
	email: z.string().email("Please provide a valid email address"),
	password: z
		.string()
		.min(8, { message: "Password must be mininum 8 characters" })
		.max(256, { message: "Password should not exceed 256 characters" }),
});

export const SignUpForm = () => {
	const router = useRouter();

	const { toast } = useToast();

	const [isVisible, setIsVisible] = useState(false);

	const { isLoading, mutate } = api.auth.signUp.useMutation({
		onError: (e) => {
			console.log(JSON.stringify(e));

			toast({
				variant: "destructive",
				description: e.message,
			});
		},
		onSuccess: () => {
			router.replace("/verify-email");
		},
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
	});

	const onSubmit = handleSubmit((data) => {
		if (isLoading === false) {
			mutate(data);
		}
	});

	const toggleVisibility = () => setIsVisible(!isVisible);

	return (
		<form className="flex flex-col gap-5" onSubmit={onSubmit}>
			<div className="flex flex-col gap-2">
				<Label htmlFor="fullName">Full name</Label>
				<Input
					placeholder="Full name"
					{...register("fullName")}
					className={cn(
						errors.fullName &&
							"border-destructive focus-visible:ring-destructive"
					)}
				/>
				{errors.fullName && (
					<span className="text-sm text-destructive">
						{errors.fullName?.message}
					</span>
				)}
			</div>

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

			<div className="pt-4">
				{isLoading ? (
					<ButtonLoading className="w-full"/>
				) : (
					<Button type="submit" className="w-full">
						Sign up
					</Button>
				)}
			</div>
		</form>
	);
};
