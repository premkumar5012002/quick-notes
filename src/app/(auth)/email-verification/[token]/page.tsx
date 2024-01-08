import Link from "next/link";
import { IconMailCheck } from "@tabler/icons-react";

import { api } from "@/trpc/server";

import { Navbar } from "../../nav-bar";
import { Button } from "@/components/ui/button";
import { TRPCClientError } from "@trpc/client";

interface Params {
	params: {
		token: string;
	};
}

export default async function Page({ params }: Params) {
	try {
		await api.auth.verifyEmail.mutate(params.token);
	} catch (e) {
		if (e instanceof TRPCClientError) {
			switch (e.message) {
				case "BAD_REQUEST": {
					throw new Error("Invalid token or expired");
				}
			}
		}
		throw new Error("Unknown error occured!");
	}
	return (
		<>
			<Navbar />
			<div className="container mx-auto relative flex pt-12 md:pt-20 flex-col items-center justify-center px-4 lg:px-0">
				<div className="mx-auto flex w-full flex-col justify-center text-center space-y-6 sm:w-[370px]">
					<div className="flex h-full flex-col items-center justify-center space-y-6">
						<div className="bg-green-100 w-28 h-28 flex items-center justify-center rounded-full">
							<IconMailCheck size={60} className="text-green-500" />
						</div>

						<div className="space-y-3">
							<h3 className="font-semibold text-2xl md:text-3xl">
								Email Verified
							</h3>

							<p className="text-sm md:text-base text-muted-foreground">
								Thank you for verifying your email.
							</p>
						</div>

						<Button asChild>
							<Link href="/notes">Go to home</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}
