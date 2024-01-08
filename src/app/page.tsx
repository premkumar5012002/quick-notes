import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getPageSession } from "@/server/auth/lucia";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default async function Home() {
	const session = await getPageSession();

	if (session) {
		return redirect("/notes");
	}

	return (
		<main>
			<Navbar />
			<div className="flex gap-8 flex-col items-center justify-center text-center py-24">
				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
					The only note taking
					<br /> app you need
				</h1>
				<p className="text-muted-foreground lg:text-[1.16rem]">
					A Simple notes taking app based on your browser and its free to use
					and open sourced.
				</p>
				<Button size="lg" asChild>
					<Link href="/sign-up">Try now</Link>
				</Button>
			</div>
			<div className="py-6 flex items-center justify-center">
				<Image
					src="/screenshot.png"
					alt="QuickNotes ScreenShot"
					width={1000}
					height={700}
					className="border rounded-md"
				/>
			</div>
			<footer className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-2 items-center justify-between pt-36 pb-6 px-6">
				<p className="text-center text-default-400 text-sm">
					&copy; 2023 All rights reserved.
				</p>
				<div className="flex items-center gap-4">
					<Link
						href="https://github.com/premkumar5012002/quick-notes"
						className="text-default-400 text-sm"
					>
						GitHub
					</Link>
				</div>
			</footer>
		</main>
	);
}
