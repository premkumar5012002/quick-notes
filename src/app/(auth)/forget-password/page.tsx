import Link from "next/link";

import { redirect } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { getPageSession } from "@/server/auth/lucia";

import { Navbar } from "../nav-bar";
import { ForgetPasswordForm } from "./forget-password-form";
import { Button } from "@/components/ui/button";

export default async function Page() {
	const session = await getPageSession();

	if (session) {
		return redirect("/notes");
	}

	return (
		<>
			<Navbar />
			<div className="relative flex pt-20 items-center justify-center mx-auto px-6 lg:px-0">
				<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col items-center space-y-2 text-center">
						<h2 className="text-2xl font-bold">Forgot your password</h2>
						<Button asChild variant="link">
							<Link href="/sign-in">
								<IconArrowLeft size={18} className="mr-1 inline" /> Back to sign
								in
							</Link>
						</Button>
					</div>
					<div className="pt-2">
						<ForgetPasswordForm />
					</div>
				</div>
			</div>
		</>
	);
}
