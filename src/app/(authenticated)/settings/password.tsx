"use client";

import { z } from "zod";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { api } from "@/trpc/react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const PasswordForm: FC = () => {
	const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
		useState(false);

	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

	const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
		useState(false);

	const { isLoading, mutate } = api.user.changePassword.useMutation({
		onError: (e) => {},
		onSuccess: () => {
			reset();
		},
	});

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<{
		currentPassword: string;
		newPassword: string;
		confirmNewPassword: string;
	}>({
		resolver: zodResolver(
			z
				.object({
					currentPassword: z
						.string()
						.min(8, { message: "Password must be mininum 8 characters" })
						.max(256, { message: "Password should not exceed 256 characters" }),
					newPassword: z
						.string()
						.min(8, { message: "Password must be mininum 8 characters" })
						.max(256, { message: "Password should not exceed 256 characters" }),
					confirmNewPassword: z.string(),
				})
				.refine(
					(values) => {
						return values.newPassword === values.confirmNewPassword;
					},
					{
						message: "New passwords must match!",
						path: ["confirmPassword"],
					}
				)
		),
		defaultValues: {
			currentPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const toggleIsCurrentPasswordVisible = () => {
		setIsCurrentPasswordVisible((state) => !state);
	};

	const toggleIsNewPasswordVisible = () => {
		setIsNewPasswordVisible((state) => !state);
	};

	const toggleIsConfirmNewPasswordVisible = () => {
		setIsConfirmNewPasswordVisible((state) => !state);
	};

	const onSubmit = handleSubmit((data) => {
		if (isLoading === false) {
			mutate(data);
		}
	});

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<div className="space-y-0.5">
				<p className="text-2xl font-bold">Password</p>
				<p className="text-sm text-default-500">
					Enter your current password to change your password
				</p>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Current Password</Label>
				<div className="relative">
					<Input
						placeholder="Enter your current password"
						{...register("currentPassword")}
						type={isCurrentPasswordVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.currentPassword &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={toggleIsCurrentPasswordVisible}>
							{isCurrentPasswordVisible ? (
								<IconEye size={20} />
							) : (
								<IconEyeOff size={20} />
							)}
						</button>
					</div>
				</div>
				{errors.currentPassword && (
					<span className="text-sm text-destructive">
						{errors.currentPassword.message}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="password">New Password</Label>
				<div className="relative">
					<Input
						placeholder="Enter your new password (minimum 8 characters)"
						{...register("newPassword")}
						type={isNewPasswordVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.newPassword &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={toggleIsNewPasswordVisible}>
							{isNewPasswordVisible ? (
								<IconEye size={20} />
							) : (
								<IconEyeOff size={20} />
							)}
						</button>
					</div>
				</div>
				{errors.newPassword && (
					<span className="text-sm text-destructive">
						{errors.newPassword.message}
					</span>
				)}
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="password">Confirm New Password</Label>
				<div className="relative">
					<Input
						placeholder="Enter your new password again"
						{...register("confirmNewPassword")}
						type={isConfirmNewPasswordVisible ? "text" : "password"}
						className={cn(
							"pr-9",
							errors.confirmNewPassword &&
								"border-destructive focus-visible:ring-destructive"
						)}
					/>
					<div className="absolute right-2.5 top-2.5">
						<button type="button" onClick={toggleIsConfirmNewPasswordVisible}>
							{isConfirmNewPasswordVisible ? (
								<IconEye size={20} />
							) : (
								<IconEyeOff size={20} />
							)}
						</button>
					</div>
				</div>
				{errors.currentPassword && (
					<span className="text-sm text-destructive">
						{errors.currentPassword.message}
					</span>
				)}
			</div>

			{isDirty && (
				<div className="flex items-center justify-end gap-4">
					<Button variant="outline" onClick={() => reset()}>
						Reset
					</Button>
					<Button type="submit" disabled={!isValid} color="primary">
						Change password
					</Button>
				</div>
			)}
		</form>
	);
};
