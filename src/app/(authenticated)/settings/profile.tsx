"use client";

import { z } from "zod";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { useUserContext } from "@/hooks/useContext";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/loading-button";

export const ProfileForm: FC = () => {
	const user = useUserContext((s) => s.user);

	const { isLoading, mutate } = api.user.changeName.useMutation({
		onError: (e) => {},
		onSuccess: () => {
			resetField("fullName", { defaultValue: getValues("fullName") });
		},
	});

	const {
		reset,
		register,
		getValues,
		resetField,
		handleSubmit,
		formState: { errors, isDirty, isValid },
	} = useForm<{ fullName: string }>({
		resolver: zodResolver(
			z.object({
				fullName: z.string().min(1, "First name can't be empty").max(128, {
					message: "First name cannot be more than 128 characters",
				}),
			})
		),
		defaultValues: {
			fullName: user.fullName,
		},
	});

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

	return (
		<form className="flex flex-col gap-8" onSubmit={onSubmit}>
			<div className="space-y-0.5">
				<p className="text-2xl font-bold">Profile</p>
				<p className="text-sm text-default-500">Update your personal details</p>
			</div>

			<div className="flex flex-col gap-2">
				<Label htmlFor="fullName">Full name</Label>
				<Input
					placeholder="Full name"
					defaultValue={user.fullName}
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
					disabled
					type="email"
					placeholder="Email"
					defaultValue={user.email}
				/>
			</div>

			{isDirty && (
				<div className="flex items-center justify-end gap-4">
					<Button variant="outline" onClick={() => reset()}>
						Reset
					</Button>
					{isLoading ? (
						<ButtonLoading />
					) : (
						<Button type="submit" disabled={!isValid}>
							Save Changes
						</Button>
					)}
				</div>
			)}
		</form>
	);
};
