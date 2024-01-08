import Link from "next/link";
import { redirect } from "next/navigation";

import { getPageSession } from "@/server/auth/lucia";

import { Navbar } from "../nav-bar";
import { SignUpForm } from "./sign-up-form";
import { Button } from "@/components/ui/button";

export default async function Page() {
	const session = await getPageSession();

	if (session) {
		let path = "/notes";

		if (session.user.isVerified === false) {
			path = "/verify-email";
		}

		return redirect(path);
	}

	return (
		<>
			<Navbar />
			<div className="relative flex pt-20 items-center justify-center mx-auto px-6 lg:px-0">
				<div className="flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col items-center space-y-2 text-center">
						<h2 className="text-2xl font-bold">Create an account</h2>
						<Button asChild variant="link">
							<Link href="/sign-in">Already have an account? Sign in</Link>
						</Button>
					</div>
					<div className="pt-2">
						<SignUpForm />
					</div>
				</div>
			</div>
		</>
	);
}
