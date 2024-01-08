"use client";

import { NoteNavbar } from "@/components/note-navbar";
import { ProfileForm } from "./profile";
import { PasswordForm } from "./password";
import { AccountOptions } from "./account";

export default function Page() {
	return (
		<>
			<NoteNavbar />
			<div className="max-w-xl mx-auto px-6 py-10 space-y-16 overflow-y-auto">
				<h2 className="text-4xl font-bold">Settings</h2>
				<ProfileForm />
				<PasswordForm />
				<AccountOptions />
			</div>
		</>
	);
}
