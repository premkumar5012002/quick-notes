"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { IconLogout, IconTrash } from "@tabler/icons-react";

import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ButtonLoading } from "@/components/loading-button";

export const AccountOptions: FC = () => {
	const router = useRouter();

	const logoutAllMutation = api.user.logoutOfAllDevice.useMutation({
		onSuccess: () => {
			router.replace("/sign-in");
		},
	});

	const deleteAccountMutation = api.user.deleteAccount.useMutation({
		onSuccess: () => {
			router.replace("/");
		},
	});

	const handleLogout = () => {
		logoutAllMutation.mutate();
	};

	const handleDeleteAccount = () => {
		deleteAccountMutation.mutate();
	};

	return (
		<>
			<div className="flex flex-col gap-8 pb-6">
				<div className="space-y-0.5">
					<p className="text-2xl font-bold">Account</p>
					<p className="text-sm text-default-500">
						Manage logout from all devices and delete your account
					</p>
				</div>

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
					<div className="space-y-0.5">
						<h2 className="text-lg font-bold">Logout of all devices</h2>
						<p className="text-sm text-muted-foreground">
							This will logout your account from all devices.
						</p>
					</div>
					{logoutAllMutation.isLoading ? (
						<ButtonLoading variant="secondary" />
					) : (
						<Button variant="secondary" onClick={handleLogout}>
							<IconLogout size={18} className="mr-2" />
							Logout all devices
						</Button>
					)}
				</div>

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
					<div className="space-y-0.5">
						<h2 className="text-lg font-bold text-destructive">
							Delete my account
						</h2>
						<p className="text-sm text-muted-foreground">
							This will permanently delete your account.
						</p>
					</div>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="destructive">
								<IconTrash size={18} className="mr-2" />
								Delete account
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Are you sure absolutely sure?</DialogTitle>
								<DialogDescription>
									This action cannot be undone. This will permanently delete
									your data from our servers.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								{deleteAccountMutation.isLoading ? (
									<ButtonLoading variant="destructive" />
								) : (
									<Button variant="destructive" onClick={handleDeleteAccount}>
										Yes, delete my account
									</Button>
								)}
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</>
	);
};
